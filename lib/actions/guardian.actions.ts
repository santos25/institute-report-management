"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "@/db/prisma";
import { AuthError, requireAdminAction } from "@/lib/auth/access";
import { isGuardianLocked } from "@/lib/auth/guardian-lockout";
import { hashPassword } from "@/lib/auth/password";
import {
  GUARDIAN_ACCESS,
  canonicalPhone,
  cleanPersonName,
  generateInitialPassword,
  normalizeCedula,
  validateCedula,
  validatePersonName,
  validatePhone,
} from "@/lib/guardian/credentials";

export type GuardianStudentLink = {
  id: string;
  name: string;
  degreeName: string;
};

export type ManagedGuardian = {
  id: string;
  identification: string;
  name: string;
  phone: string | null;
  mustChangePassword: boolean;
  locked: boolean;
  students: GuardianStudentLink[];
};

export type LinkableStudent = {
  id: string;
  name: string;
  degreeName: string;
  guardianId: string | null;
  guardianName: string | null;
};

export type IssuedGuardianPassword = {
  name: string;
  identification: string;
  phone: string | null;
  password: string;
};

export type GuardianActionResult =
  | { ok: true; issued?: IssuedGuardianPassword }
  | { ok: false; error: string };

function actionError(error: unknown, duplicate: string): GuardianActionResult {
  if (error instanceof AuthError) return { ok: false, error: error.message };
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return { ok: false, error: duplicate };
  }
  console.error("Error administrando acudientes:", error);
  return { ok: false, error: "No se pudo guardar. Intenta de nuevo." };
}

function revalidateGuardianViews() {
  revalidatePath("/acudientes");
  revalidatePath("/familias");
}

async function issuePassword(guardian: {
  id: string;
  name: string;
  identification: string;
  phone: string | null;
}): Promise<IssuedGuardianPassword> {
  const password = generateInitialPassword();
  await prisma.guardian.update({
    where: { id: guardian.id },
    data: {
      password: await hashPassword(password),
      mustChangePassword: true,
      failedAttempts: 0,
      lockedUntil: null,
    },
  });
  await prisma.guardianAccessLog.create({
    data: { guardianId: guardian.id, action: GUARDIAN_ACCESS.PASSWORD_RESET },
  });
  return {
    name: guardian.name,
    identification: guardian.identification,
    phone: guardian.phone,
    password,
  };
}

export async function getGuardiansPageData() {
  await requireAdminAction();

  const [guardians, students] = await Promise.all([
    prisma.guardian.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        identification: true,
        name: true,
        phone: true,
        mustChangePassword: true,
        lockedUntil: true,
        students: {
          select: {
            id: true,
            name: true,
            degree: { select: { name: true } },
          },
          orderBy: { name: "asc" },
        },
      },
    }),
    prisma.student.findMany({
      select: {
        id: true,
        name: true,
        guardianId: true,
        degree: { select: { name: true } },
        guardian: { select: { name: true } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const now = new Date();

  return {
    guardians: guardians.map((guardian) => ({
      id: guardian.id,
      identification: guardian.identification,
      name: guardian.name,
      phone: guardian.phone,
      mustChangePassword: guardian.mustChangePassword,
      locked: isGuardianLocked(guardian.lockedUntil, now),
      students: guardian.students.map((student) => ({
        id: student.id,
        name: student.name,
        degreeName: student.degree.name,
      })),
    })),
    students: students.map((student) => ({
      id: student.id,
      name: student.name,
      degreeName: student.degree.name,
      guardianId: student.guardianId,
      guardianName: student.guardian?.name ?? null,
    })),
  };
}

export async function createGuardian(input: {
  identification: string;
  name: string;
  phone: string;
}): Promise<GuardianActionResult> {
  try {
    await requireAdminAction();
    const identification = normalizeCedula(input.identification);
    const name = cleanPersonName(input.name);
    const phoneError = validatePhone(input.phone);
    const cedulaError = validateCedula(identification);
    const nameError = validatePersonName(name);
    const error = cedulaError ?? nameError ?? phoneError;
    if (error) return { ok: false, error };

    const phone = canonicalPhone(input.phone);
    const password = generateInitialPassword();
    const guardian = await prisma.guardian.create({
      data: {
        identification,
        name,
        phone,
        password: await hashPassword(password),
        mustChangePassword: true,
      },
      select: { name: true, identification: true, phone: true },
    });
    revalidateGuardianViews();
    return {
      ok: true,
      issued: {
        name: guardian.name,
        identification: guardian.identification,
        phone: guardian.phone,
        password,
      },
    };
  } catch (error) {
    return actionError(error, "Ya existe un acudiente con esa cédula.");
  }
}

export async function updateGuardian(input: {
  id: string;
  identification: string;
  name: string;
  phone: string;
}): Promise<GuardianActionResult> {
  try {
    await requireAdminAction();
    const identification = normalizeCedula(input.identification);
    const name = cleanPersonName(input.name);
    const error =
      validateCedula(identification) ??
      validatePersonName(name) ??
      validatePhone(input.phone);
    if (error) return { ok: false, error };

    await prisma.guardian.update({
      where: { id: input.id },
      data: {
        identification,
        name,
        phone: canonicalPhone(input.phone),
      },
    });
    revalidateGuardianViews();
    return { ok: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { ok: false, error: "Ese acudiente ya no existe." };
    }
    return actionError(error, "Ya existe un acudiente con esa cédula.");
  }
}

export async function resetGuardianPassword(
  guardianId: string
): Promise<GuardianActionResult> {
  try {
    await requireAdminAction();
    const guardian = await prisma.guardian.findUnique({
      where: { id: guardianId },
      select: { id: true, name: true, identification: true, phone: true },
    });
    if (!guardian) return { ok: false, error: "Ese acudiente ya no existe." };
    const issued = await issuePassword(guardian);
    revalidateGuardianViews();
    return { ok: true, issued };
  } catch (error) {
    return actionError(error, "No se pudo restablecer la clave.");
  }
}

export async function linkGuardianStudent(input: {
  guardianId: string;
  studentId: string;
}): Promise<GuardianActionResult> {
  try {
    await requireAdminAction();
    const [guardian, student] = await Promise.all([
      prisma.guardian.findUnique({
        where: { id: input.guardianId },
        select: { id: true },
      }),
      prisma.student.findUnique({
        where: { id: input.studentId },
        select: {
          id: true,
          guardianId: true,
          guardian: { select: { name: true } },
        },
      }),
    ]);

    if (!guardian) return { ok: false, error: "Ese acudiente ya no existe." };
    if (!student) return { ok: false, error: "Ese estudiante ya no existe." };
    if (student.guardianId === guardian.id) {
      revalidateGuardianViews();
      return { ok: true };
    }
    if (student.guardianId) {
      return {
        ok: false,
        error: `Ese estudiante ya está vinculado a ${student.guardian?.name ?? "otro acudiente"}. Desvincúlalo primero.`,
      };
    }

    await prisma.student.update({
      where: { id: student.id },
      data: { guardianId: guardian.id },
    });
    revalidateGuardianViews();
    return { ok: true };
  } catch (error) {
    return actionError(error, "No se pudo vincular el estudiante.");
  }
}

export async function unlinkGuardianStudent(input: {
  guardianId: string;
  studentId: string;
}): Promise<GuardianActionResult> {
  try {
    await requireAdminAction();
    const updated = await prisma.student.updateMany({
      where: { id: input.studentId, guardianId: input.guardianId },
      data: { guardianId: null },
    });
    if (updated.count === 0) {
      return { ok: false, error: "Ese estudiante no está vinculado a este acudiente." };
    }
    revalidateGuardianViews();
    return { ok: true };
  } catch (error) {
    return actionError(error, "No se pudo desvincular el estudiante.");
  }
}
