"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/db/prisma";
import { AuthError, requireAdminAction } from "@/lib/auth/access";
import { hashPassword } from "@/lib/auth/password";
import { isRole, type Role } from "@/lib/auth/roles";

export type ManagedUser = {
  id: string;
  name: string;
  username: string;
  role: Role;
  degrees: { id: string; name: string }[];
};

export type UserActionResult = { ok: true } | { ok: false; error: string };

const USERNAME_PATTERN = /^[a-z0-9._-]{3,32}$/;

function cleanName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function cleanUsername(value: string) {
  return value.trim().toLowerCase();
}

function uniqueIds(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function validateName(name: string): string | null {
  if (name.length < 2 || name.length > 80) {
    return "Escribe un nombre de entre 2 y 80 caracteres.";
  }
  return null;
}

function validateUsername(username: string): string | null {
  if (!USERNAME_PATTERN.test(username)) {
    return "El usuario debe tener entre 3 y 32 caracteres: letras, números, puntos o guiones.";
  }
  return null;
}

function validatePassword(password: string, required: boolean): string | null {
  if (!password) {
    return required ? "Escribe una contraseña de al menos 8 caracteres." : null;
  }
  if (password.length < 8 || password.length > 128) {
    return "La contraseña debe tener entre 8 y 128 caracteres.";
  }
  return null;
}

async function degreesOrError(ids: string[]) {
  if (ids.length === 0) return [];
  const found = await prisma.degree.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  if (found.length !== ids.length) {
    return null;
  }
  return found.map((degree) => degree.id);
}

function actionError(error: unknown): UserActionResult {
  if (error instanceof AuthError) {
    return { ok: false, error: error.message };
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return { ok: false, error: "Ese usuario ya existe." };
  }
  console.error("Error administrando usuarios:", error);
  return { ok: false, error: "No se pudo guardar el usuario. Intenta de nuevo." };
}

export async function getUsersPageData() {
  await requireAdminAction();

  const [users, degrees] = await Promise.all([
    prisma.user.findMany({
      orderBy: [{ role: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        degrees: { select: { id: true, name: true } },
      },
    }),
    prisma.degree.findMany(),
  ]);

  return {
    users: users.flatMap((user) =>
      isRole(user.role)
        ? [
            {
              id: user.id,
              name: user.name,
              username: user.username,
              role: user.role,
              degrees: user.degrees,
            },
          ]
        : []
    ),
    degrees,
  };
}

export async function createUser(input: {
  name: string;
  username: string;
  password: string;
  role: string;
  degreeIds: string[];
}): Promise<UserActionResult> {
  try {
    await requireAdminAction();

    const name = cleanName(input.name ?? "");
    const username = cleanUsername(input.username ?? "");
    const password = String(input.password ?? "");
    const role = String(input.role ?? "");
    const degreeIds = uniqueIds(input.degreeIds ?? []);

    const nameError = validateName(name);
    if (nameError) return { ok: false, error: nameError };
    const usernameError = validateUsername(username);
    if (usernameError) return { ok: false, error: usernameError };
    const passwordError = validatePassword(password, true);
    if (passwordError) return { ok: false, error: passwordError };
    if (!isRole(role)) return { ok: false, error: "Selecciona un rol válido." };

    const degrees =
      role === "TEACHER" ? await degreesOrError(degreeIds) : [];
    if (degrees === null) {
      return { ok: false, error: "Hay grados que no existen." };
    }

    await prisma.user.create({
      data: {
        name,
        username,
        password: await hashPassword(password),
        role,
        degrees: { connect: degrees.map((id) => ({ id })) },
      },
    });

    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateUser(input: {
  id: string;
  name: string;
  role: string;
  password?: string;
  degreeIds: string[];
}): Promise<UserActionResult> {
  try {
    await requireAdminAction();

    const id = String(input.id ?? "");
    const name = cleanName(input.name ?? "");
    const password = String(input.password ?? "");
    const role = String(input.role ?? "");
    const degreeIds = uniqueIds(input.degreeIds ?? []);

    if (!id) return { ok: false, error: "No se encontró el usuario." };
    const nameError = validateName(name);
    if (nameError) return { ok: false, error: nameError };
    const passwordError = validatePassword(password, false);
    if (passwordError) return { ok: false, error: passwordError };
    if (!isRole(role)) return { ok: false, error: "Selecciona un rol válido." };

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) return { ok: false, error: "No se encontró el usuario." };

    const degrees =
      role === "TEACHER" ? await degreesOrError(degreeIds) : [];
    if (degrees === null) {
      return { ok: false, error: "Hay grados que no existen." };
    }

    await prisma.user.update({
      where: { id },
      data: {
        name,
        role,
        ...(password ? { password: await hashPassword(password) } : {}),
        degrees: { set: degrees.map((degreeId) => ({ id: degreeId })) },
      },
    });

    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteUser(id: string): Promise<UserActionResult> {
  try {
    const actor = await requireAdminAction();
    if (!id) return { ok: false, error: "No se encontró el usuario." };
    if (id === actor.id) {
      return { ok: false, error: "No puedes eliminar tu propia cuenta." };
    }

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) return { ok: false, error: "No se encontró el usuario." };

    await prisma.user.delete({ where: { id } });
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}
