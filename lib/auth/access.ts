import prisma from "@/db/prisma";
import {
  getActionUser,
  type ActionUser,
} from "@/lib/auth/session";

export class AuthError extends Error {
  constructor(message = "No autorizado.") {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireActionUser(): Promise<ActionUser> {
  const user = await getActionUser();
  if (!user) throw new AuthError("No autorizado.");
  return user;
}

export async function requireAdminAction(): Promise<ActionUser> {
  const user = await requireActionUser();
  if (user.role !== "ADMIN") {
    throw new AuthError("No tienes permiso para administrar usuarios.");
  }
  return user;
}

export async function requireStudentAdmin(): Promise<ActionUser> {
  const user = await requireActionUser();
  if (user.role !== "ADMIN") {
    throw new AuthError(
      "Solo el administrador puede crear, editar o eliminar estudiantes."
    );
  }
  return user;
}

export function assertDegreeAccess(user: ActionUser, degreeId: string) {
  if (user.role === "ADMIN") return;
  if (!user.degreeIds.includes(degreeId)) {
    throw new AuthError("No tienes permiso para consultar este grado.");
  }
}

export async function assertStudentAccess(user: ActionUser, studentId: string) {
  if (user.role === "ADMIN") return;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { degreeId: true },
  });

  if (!student || !user.degreeIds.includes(student.degreeId)) {
    throw new AuthError("No tienes permiso para consultar este estudiante.");
  }
}

export async function assertStudentsAccess(
  user: ActionUser,
  studentIds: string[]
) {
  if (user.role === "ADMIN") return;

  const uniqueIds = [...new Set(studentIds)];
  if (uniqueIds.length === 0) return;

  const students = await prisma.student.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true, degreeId: true },
  });

  const allowed = new Set(user.degreeIds);
  const blocked =
    students.length !== uniqueIds.length ||
    students.some((student) => !allowed.has(student.degreeId));

  if (blocked) {
    throw new AuthError("No tienes permiso para modificar estos estudiantes.");
  }
}
