"use server";

import prisma from "@/db/prisma";
import {
  assertDegreeAccess,
  canEditDegreeObservations,
  requireActionUser,
} from "@/lib/auth/access";
import { normalizeObservation } from "@/lib/observation-draft";

type ObservationSummary =
  | { success: true; filled: number; total: number }
  | { success: false; error: string; filled: number; total: number };

export type DegreeObservationStudent = {
  id: string;
  name: string;
  content: string;
};

type DegreeObservationsResult =
  | {
      success: true;
      canEdit: boolean;
      students: DegreeObservationStudent[];
    }
  | { success: false; error: string };

type SaveDegreeObservationsResult =
  | { success: true }
  | { success: false; error: string };

async function observationCounts(degreeId: string, periodId: string) {
  const [total, rows] = await Promise.all([
    prisma.student.count({ where: { degreeId } }),
    prisma.studentObservation.findMany({
      where: { periodId, student: { degreeId } },
      select: { content: true },
    }),
  ]);

  const filled = rows.filter(
    (row) => normalizeObservation(row.content) !== ""
  ).length;

  return { filled, total };
}

export async function getObservationSummary(
  degreeId: string,
  periodId: string
): Promise<ObservationSummary> {
  try {
    const user = await requireActionUser();
    assertDegreeAccess(user, degreeId);
    const counts = await observationCounts(degreeId, periodId);
    return { success: true, ...counts };
  } catch (error) {
    console.error("Error contando observaciones del grado:", error);
    return {
      success: false,
      error: (error as Error).message,
      filled: 0,
      total: 0,
    };
  }
}

export async function getDegreeObservations(
  degreeId: string,
  periodId: string
): Promise<DegreeObservationsResult> {
  try {
    const user = await requireActionUser();
    assertDegreeAccess(user, degreeId);

    const students = await prisma.student.findMany({
      where: { degreeId },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        observations: {
          where: { periodId },
          select: { content: true },
          take: 1,
        },
      },
    });

    return {
      success: true,
      canEdit: canEditDegreeObservations(user, degreeId),
      students: students.map((student) => ({
        id: student.id,
        name: student.name,
        content: student.observations[0]?.content ?? "",
      })),
    };
  } catch (error) {
    console.error("Error consultando observaciones del grado:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function saveDegreeObservations(input: {
  degreeId: string;
  periodId: string;
  observations: { studentId: string; content: string }[];
}): Promise<SaveDegreeObservationsResult> {
  try {
    const user = await requireActionUser();
    assertDegreeAccess(user, input.degreeId);

    if (!canEditDegreeObservations(user, input.degreeId)) {
      return {
        success: false,
        error: "No tienes permiso para editar las observaciones de este grado.",
      };
    }

    const byStudent = new Map<string, string>();
    for (const entry of input.observations) {
      byStudent.set(entry.studentId, normalizeObservation(entry.content));
    }

    const studentIds = [...byStudent.keys()];
    if (studentIds.length === 0) return { success: true };

    const [period, students] = await Promise.all([
      prisma.period.findUnique({
        where: { id: input.periodId },
        select: { id: true },
      }),
      prisma.student.findMany({
        where: { degreeId: input.degreeId, id: { in: studentIds } },
        select: { id: true },
      }),
    ]);

    if (!period) {
      return { success: false, error: "No se encontró el periodo." };
    }

    if (students.length !== studentIds.length) {
      return {
        success: false,
        error: "Hay estudiantes que no pertenecen a este grado.",
      };
    }

    await prisma.$transaction(async (tx) => {
      for (const studentId of studentIds) {
        const content = byStudent.get(studentId) ?? "";

        if (!content) {
          await tx.studentObservation.deleteMany({
            where: { studentId, periodId: input.periodId },
          });
          continue;
        }

        await tx.studentObservation.upsert({
          where: {
            studentId_periodId: {
              studentId,
              periodId: input.periodId,
            },
          },
          update: { content },
          create: {
            studentId,
            periodId: input.periodId,
            content,
          },
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error guardando observaciones del grado:", error);
    return { success: false, error: (error as Error).message };
  }
}
