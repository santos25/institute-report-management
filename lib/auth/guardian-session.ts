import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/db/prisma";
import {
  GUARDIAN_SESSION_COOKIE,
  GUARDIAN_SESSION_MAX_AGE_SECONDS,
  signGuardianSession,
  verifyGuardianToken,
  type GuardianSessionPayload,
} from "@/lib/auth/guardian-token";

export type CurrentGuardian = {
  id: string;
  identification: string;
  name: string;
  mustChangePassword: boolean;
};

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function readGuardianPayload(): Promise<GuardianSessionPayload | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  const token = (await cookies()).get(GUARDIAN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyGuardianToken(token, secret);
}

export const readCurrentGuardian = cache(async (): Promise<CurrentGuardian | null> => {
  const payload = await readGuardianPayload();
  if (!payload) return null;

  const guardian = await prisma.guardian.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      identification: true,
      name: true,
      mustChangePassword: true,
    },
  });

  if (!guardian || guardian.identification !== payload.identification) return null;
  return guardian;
});

export async function requireGuardian(): Promise<CurrentGuardian> {
  const guardian = await readCurrentGuardian();
  if (!guardian) {
    await clearGuardianSession();
    redirect("/familias/login");
  }
  return guardian;
}

export async function createGuardianSession(guardian: {
  id: string;
  identification: string;
  name: string;
}) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET no está configurado");
  }

  const token = await signGuardianSession(
    {
      typ: "guardian",
      sub: guardian.id,
      identification: guardian.identification,
      name: guardian.name,
      exp: Math.floor(Date.now() / 1000) + GUARDIAN_SESSION_MAX_AGE_SECONDS,
    },
    secret
  );

  (await cookies()).set(
    GUARDIAN_SESSION_COOKIE,
    token,
    cookieOptions(GUARDIAN_SESSION_MAX_AGE_SECONDS)
  );
}

export async function clearGuardianSession() {
  (await cookies()).set(GUARDIAN_SESSION_COOKIE, "", cookieOptions(0));
}
