import prisma from "@/db/prisma";
import {
  buildChildDetail,
  childBoletinAction,
  childDetailAction,
  type ChildDetail,
} from "@/lib/guardian/child-detail";

/**
 * Detalle de un hijo del acudiente de la sesión: año indicado y periodos publicados.
 * El id de la URL no basta: la fila tiene que tener ese guardianId.
 * Si no hay coincidencia, no se lee ni se registra nada.
 */
export async function getGuardianChildDetail(input: {
  guardianId: string;
  studentId: string;
  year: number;
  access?: "detail" | "boletin";
}): Promise<ChildDetail | null> {
  if (!input.guardianId || !input.studentId) return null;

  const student = await prisma.student.findFirst({
    where: {
      id: input.studentId,
      guardianId: input.guardianId,
    },
    select: {
      id: true,
      name: true,
      guardianId: true,
      degree: { select: { id: true, name: true } },
    },
  });

  if (!student || student.guardianId !== input.guardianId) return null;

  const periods = await prisma.period.findMany({
    where: { year: input.year, visibleToGuardians: true },
    select: { id: true, number: true, year: true, visibleToGuardians: true },
    orderBy: { number: "asc" },
  });
  const periodIds = periods.map((period) => period.id);

  const [grades, observations] =
    periodIds.length === 0
      ? [[], []]
      : await Promise.all([
          prisma.studentGrade.findMany({
            where: {
              studentId: student.id,
              periodId: { in: periodIds },
            },
            select: {
              studentId: true,
              periodId: true,
              grade: true,
              achievements: true,
              subject: { select: { id: true, name: true } },
            },
          }),
          prisma.studentObservation.findMany({
            where: {
              studentId: student.id,
              periodId: { in: periodIds },
            },
            select: { studentId: true, periodId: true, content: true },
          }),
        ]);

  const detail = buildChildDetail({
    guardianId: input.guardianId,
    year: input.year,
    student: {
      id: student.id,
      name: student.name,
      guardianId: student.guardianId,
      degreeId: student.degree.id,
      degreeName: student.degree.name,
    },
    periods: periods.map((period) => ({
      id: period.id,
      number: period.number,
      year: period.year,
      published: period.visibleToGuardians,
    })),
    grades: grades.map((grade) => ({
      studentId: grade.studentId,
      periodId: grade.periodId,
      subjectId: grade.subject.id,
      subjectName: grade.subject.name,
      grade: grade.grade,
      achievements: grade.achievements,
    })),
    observations,
  });

  if (!detail) return null;

  await prisma.guardianAccessLog.create({
    data: {
      guardianId: input.guardianId,
      action:
        input.access === "boletin"
          ? childBoletinAction(student.id)
          : childDetailAction(student.id),
    },
  });

  return detail;
}
