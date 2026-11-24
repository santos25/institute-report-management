"use server";

import prisma from "@/db/prisma";
import {
  ANNUAL_PERIOD_NUMBERS,
  AnnualDegreeReport,
  buildAnnualDegreeReport,
} from "@/lib/annual-report";

/** Años lectivos que ya existen en Period, del más reciente al más antiguo. */
export async function getAnnualSchoolYears(): Promise<number[]> {
  const rows = await prisma.period.findMany({
    distinct: ["year"],
    select: { year: true },
    orderBy: { year: "desc" },
  });

  return rows.map((row) => row.year);
}

/**
 * Consolidado anual de solo lectura.
 * No crea, actualiza ni borra periodos, notas ni estudiantes.
 */
export async function getAnnualDegreeReport(
  degreeId: string,
  year: string
): Promise<AnnualDegreeReport> {
  const yearInt = Number.parseInt(year, 10);
  if (!Number.isFinite(yearInt)) {
    throw new Error("El año lectivo no es válido");
  }

  const degree = await prisma.degree.findUnique({
    where: { id: degreeId },
    select: {
      id: true,
      name: true,
      subjects: {
        select: { id: true, name: true },
      },
    },
  });

  if (!degree) {
    throw new Error("No se encontró el grado seleccionado");
  }

  const [periods, students] = await Promise.all([
    prisma.period.findMany({
      where: {
        year: yearInt,
        number: { in: [...ANNUAL_PERIOD_NUMBERS] },
      },
      select: { id: true, number: true },
      orderBy: { number: "asc" },
    }),
    prisma.student.findMany({
      where: { degreeId },
      select: { id: true, name: true, degreeId: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const subjectIds = degree.subjects.map((subject) => subject.id);
  const studentIds = students.map((student) => student.id);
  const periodIds = periods.map((period) => period.id);

  const grades =
    subjectIds.length === 0 || studentIds.length === 0 || periodIds.length === 0
      ? []
      : await prisma.studentGrade.findMany({
          where: {
            studentId: { in: studentIds },
            subjectId: { in: subjectIds },
            periodId: { in: periodIds },
          },
          select: {
            studentId: true,
            subjectId: true,
            periodId: true,
            grade: true,
          },
        });

  const periodNumberById = new Map(
    periods.map((period) => [period.id, period.number])
  );

  return buildAnnualDegreeReport({
    year: yearInt,
    degree: { id: degree.id, name: degree.name },
    subjects: degree.subjects,
    students,
    periodsOnRecord: periods.map((period) => period.number),
    grades: grades.flatMap((grade) => {
      const periodNumber = periodNumberById.get(grade.periodId);
      if (periodNumber == null) return [];
      return [
        {
          studentId: grade.studentId,
          subjectId: grade.subjectId,
          periodNumber,
          grade: grade.grade,
        },
      ];
    }),
  });
}
