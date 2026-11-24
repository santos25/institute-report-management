"use server";

import { redirect } from "next/navigation";
import prisma from "@/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { isRole } from "@/lib/auth/roles";
import { clearSession, createSession } from "@/lib/auth/session";

export type LoginState = {
  error: string;
};

function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Ingresa tu usuario y contraseña." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    const passwordOk = await verifyPassword(password, user?.password ?? "");

    if (!user || !passwordOk || !isRole(user.role)) {
      return { error: "Usuario o contraseña incorrectos." };
    }

    await createSession({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { error: "No se pudo iniciar sesión. Intenta de nuevo." };
  }

  redirect("/planillas");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}
