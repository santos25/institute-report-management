"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "@/db/prisma";
import {
  assertDegreeAccess,
  AuthError,
  requireActionUser,
  requireStudentAdmin,
} from "@/lib/auth/access";

export type ManagedStudent = {
  id: string;
  name: string;
  identification: string;
  degreeId: string;
  degreeName: string;
  gradeCount: number;
  observationCount: number;
};

export type StudentActionResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      requiresAcknowledgement?: boolean;
      gradeCount?: number;
      observationCount?: number;
    };

const IDENTIFICATION_PATTERN = /^[A-Za-z0-9.\- ]{3,32}$/;

function cleanName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function cleanIdentification(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function validateName(name: string): string | null {
  if (name.length < 2 || name.length > 120) {
    return "Escribe el nombre completo, entre 2 y 120 caracteres.";
  }
  return null;
}

function validateIdentification(identification: string): string | null {
  if (!IDENTIFICATION_PATTERN.test(identification)) {
    return "El documento debe tener entre 3 y 32 caracteres: letras, números, puntos o guiones.";
  }
  return null;
}

function revalidateStudentViews() {
  revalidatePath("/estudiantes");
  revalidatePath("/planillas");
  revalidatePath("/boletines");
}

function actionError(error: unknown): StudentActionResult {
  if (error instanceof AuthError) {
    return { ok: false, error: error.message };
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2003") {
      return {
        ok: false,
        error:
          "No se pudo eliminar el estudiante porque todavía tiene notas u observaciones relacionadas.",
      };
    }
    if (error.code === "P2025") {
      return { ok: false, error: "Ese estudiante ya no existe." };
    }
  }
  console.error("Error administrando estudiantes:", error);
  return {
    ok: false,
    error: "No se pudo guardar el estudiante. Intenta de nuevo.",
  };
}

async function degreeOrError(degreeId: string) {
  if (!degreeId) return null;
  return prisma.degree.findUnique({
    where: { id: degreeId },
    select: { id: true },
  });
}

async function identificationTaken(identification: string, ignoreId?: string) {
  const existing = await prisma.student.findFirst({
    where: {
      identification: { equals: identification, mode: "insensitive" },
      ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
    },
    select: { id: true },
  });
  return Boolean(existing);
}

export async function getStudentsByDegree(degreeId: string) {
  try {
    const user = await requireActionUser();
    assertDegreeAccess(user, degreeId);

    const students = await prisma.student.findMany({
      where: {
        degreeId: degreeId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return students;
  } catch (error) {
    console.error("Error fetching students by degree:", error);
    throw error;
  }
}

export async function getStudentsPageData() {
  const user = await requireActionUser();
  const limited = user.role !== "ADMIN";

  const [students, degrees] = await Promise.all([
    prisma.student.findMany({
      where: limited ? { degreeId: { in: user.degreeIds } } : {},
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        identification: true,
        degreeId: true,
        degree: { select: { name: true } },
        _count: { select: { grades: true, observations: true } },
      },
    }),
    prisma.degree.findMany({
      where: limited ? { id: { in: user.degreeIds } } : {},
    }),
  ]);

  return {
    students: students.map((student) => ({
      id: student.id,
      name: student.name,
      identification: student.identification,
      degreeId: student.degreeId,
      degreeName: student.degree.name,
      gradeCount: student._count.grades,
      observationCount: student._count.observations,
    })),
    degrees,
  };
}

export async function createStudent(input: {
  name: string;
  identification: string;
  degreeId: string;
}): Promise<StudentActionResult> {
  try {
    await requireStudentAdmin();

    const name = cleanName(input.name ?? "");
    const identification = cleanIdentification(input.identification ?? "");
    const degreeId = String(input.degreeId ?? "").trim();

    const nameError = validateName(name);
    if (nameError) return { ok: false, error: nameError };
    const identificationError = validateIdentification(identification);
    if (identificationError) return { ok: false, error: identificationError };

    const degree = await degreeOrError(degreeId);
    if (!degree) return { ok: false, error: "Selecciona un grado válido." };
    if (await identificationTaken(identification)) {
      return {
        ok: false,
        error: "Ya hay un estudiante con ese documento de identidad.",
      };
    }

    await prisma.student.create({
      data: { name, identification, degreeId },
    });
    revalidateStudentViews();
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateStudent(input: {
  id: string;
  name: string;
  identification: string;
  degreeId: string;
}): Promise<StudentActionResult> {
  try {
    await requireStudentAdmin();

    const id = String(input.id ?? "").trim();
    const name = cleanName(input.name ?? "");
    const identification = cleanIdentification(input.identification ?? "");
    const degreeId = String(input.degreeId ?? "").trim();

    if (!id) return { ok: false, error: "No se encontró el estudiante." };
    const nameError = validateName(name);
    if (nameError) return { ok: false, error: nameError };
    const identificationError = validateIdentification(identification);
    if (identificationError) return { ok: false, error: identificationError };

    const existing = await prisma.student.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) return { ok: false, error: "Ese estudiante ya no existe." };

    const degree = await degreeOrError(degreeId);
    if (!degree) return { ok: false, error: "Selecciona un grado válido." };
    if (await identificationTaken(identification, id)) {
      return {
        ok: false,
        error: "Ya hay un estudiante con ese documento de identidad.",
      };
    }

    await prisma.student.update({
      where: { id },
      data: { name, identification, degreeId },
    });
    revalidateStudentViews();
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteStudent(
  id: string,
  acknowledgeRecords = false
): Promise<StudentActionResult> {
  try {
    await requireStudentAdmin();
    const studentId = String(id ?? "").trim();
    if (!studentId) return { ok: false, error: "No se encontró el estudiante." };

    const existing = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        _count: { select: { grades: true, observations: true } },
      },
    });
    if (!existing) return { ok: false, error: "Ese estudiante ya no existe." };

    const gradeCount = existing._count.grades;
    const observationCount = existing._count.observations;
    if ((gradeCount > 0 || observationCount > 0) && !acknowledgeRecords) {
      return {
        ok: false,
        error:
          "Este estudiante tiene notas u observaciones. Confirma que también quieres eliminar esos registros.",
        requiresAcknowledgement: true,
        gradeCount,
        observationCount,
      };
    }

    await prisma.$transaction([
      prisma.studentGrade.deleteMany({ where: { studentId } }),
      prisma.studentObservation.deleteMany({ where: { studentId } }),
      prisma.student.delete({ where: { id: studentId } }),
    ]);

    revalidateStudentViews();
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
} 