import prisma from "@/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  GUARDIAN_INVALID_LOGIN,
  GUARDIAN_LOCKED_LOGIN,
  isGuardianLocked,
  registerFailedAttempt,
} from "@/lib/auth/guardian-lockout";
import {
  GUARDIAN_ACCESS,
  normalizeCedula,
  validateCedula,
  validateChosenPassword,
} from "@/lib/guardian/credentials";

export type AuthenticatedGuardian = {
  id: string;
  identification: string;
  name: string;
  mustChangePassword: boolean;
};

export type GuardianLoginResult =
  | { ok: true; guardian: AuthenticatedGuardian }
  | { ok: false; error: string };

async function logAccess(guardianId: string, action: string) {
  await prisma.guardianAccessLog.create({
    data: { guardianId, action },
  });
}

export async function authenticateGuardian(
  rawCedula: string,
  password: string,
  now = new Date()
): Promise<GuardianLoginResult> {
  const identification = normalizeCedula(rawCedula);
  if (!identification || !password) {
    return { ok: false, error: "Ingresa tu cédula y tu clave." };
  }
  if (validateCedula(identification)) {
    return { ok: false, error: GUARDIAN_INVALID_LOGIN };
  }

  const guardian = await prisma.guardian.findUnique({
    where: { identification },
  });

  if (guardian && isGuardianLocked(guardian.lockedUntil, now)) {
    await verifyPassword(password, guardian.password);
    return { ok: false, error: GUARDIAN_LOCKED_LOGIN };
  }

  const passwordOk = await verifyPassword(password, guardian?.password ?? "");
  if (!guardian || !passwordOk) {
    if (guardian) {
      const next = registerFailedAttempt(
        {
          failedAttempts: guardian.failedAttempts,
          lockedUntil: guardian.lockedUntil,
        },
        now
      );
      await prisma.guardian.update({
        where: { id: guardian.id },
        data: {
          failedAttempts: next.failedAttempts,
          lockedUntil: next.lockedUntil,
        },
      });
      if (next.locked) {
        return { ok: false, error: GUARDIAN_LOCKED_LOGIN };
      }
    }
    return { ok: false, error: GUARDIAN_INVALID_LOGIN };
  }

  await prisma.guardian.update({
    where: { id: guardian.id },
    data: { failedAttempts: 0, lockedUntil: null },
  });
  await logAccess(guardian.id, GUARDIAN_ACCESS.LOGIN);

  return {
    ok: true,
    guardian: {
      id: guardian.id,
      identification: guardian.identification,
      name: guardian.name,
      mustChangePassword: guardian.mustChangePassword,
    },
  };
}

export async function changeGuardianPassword(input: {
  guardianId: string;
  password: string;
  confirmation: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const formatError = validateChosenPassword(input.password, input.confirmation);
  if (formatError) return { ok: false, error: formatError };

  const guardian = await prisma.guardian.findUnique({
    where: { id: input.guardianId },
    select: { id: true, password: true, mustChangePassword: true },
  });

  if (!guardian || !guardian.mustChangePassword) {
    return { ok: false, error: "Ya definiste tu clave. Si la olvidaste, pídele al colegio una clave nueva." };
  }

  const sameAsInitial = await verifyPassword(input.password, guardian.password);
  if (sameAsInitial) {
    return { ok: false, error: "Elige una clave distinta a la inicial." };
  }

  await prisma.guardian.update({
    where: { id: guardian.id },
    data: {
      password: await hashPassword(input.password),
      mustChangePassword: false,
      failedAttempts: 0,
      lockedUntil: null,
    },
  });
  await logAccess(guardian.id, GUARDIAN_ACCESS.PASSWORD_CHANGED);
  return { ok: true };
}
