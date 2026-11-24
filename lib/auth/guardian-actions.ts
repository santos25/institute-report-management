"use server";

import { redirect } from "next/navigation";
import { clearGuardianSession, createGuardianSession, readCurrentGuardian } from "@/lib/auth/guardian-session";
import { authenticateGuardian, changeGuardianPassword } from "@/lib/auth/guardian-login";
import prisma from "@/db/prisma";
import { GUARDIAN_ACCESS } from "@/lib/guardian/credentials";

export type GuardianFormState = {
  error: string;
};

export async function loginGuardian(
  _prev: GuardianFormState,
  formData: FormData
): Promise<GuardianFormState> {
  const result = await authenticateGuardian(
    String(formData.get("identification") ?? ""),
    String(formData.get("password") ?? "")
  );

  if (!result.ok) return { error: result.error };

  try {
    await createGuardianSession(result.guardian);
  } catch (error) {
    console.error("Error al crear la sesión del acudiente:", error);
    return { error: "No se pudo iniciar sesión. Intenta de nuevo." };
  }

  if (result.guardian.mustChangePassword) {
    redirect("/familias/cambiar-clave");
  }
  redirect("/familias");
}

export async function changeGuardianPasswordAction(
  _prev: GuardianFormState,
  formData: FormData
): Promise<GuardianFormState> {
  const guardian = await readCurrentGuardian();
  if (!guardian) {
    redirect("/familias/login");
  }

  const result = await changeGuardianPassword({
    guardianId: guardian.id,
    password: String(formData.get("password") ?? ""),
    confirmation: String(formData.get("confirmation") ?? ""),
  });

  if (!result.ok) return { error: result.error };
  redirect("/familias");
}

export async function logoutGuardian() {
  const guardian = await readCurrentGuardian();
  if (guardian) {
    await prisma.guardianAccessLog
      .create({
        data: { guardianId: guardian.id, action: GUARDIAN_ACCESS.LOGOUT },
      })
      .catch((error: unknown) => {
        console.error("No se pudo registrar la salida del acudiente:", error);
      });
  }
  await clearGuardianSession();
  redirect("/familias/login");
}
