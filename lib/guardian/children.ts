import prisma from "@/db/prisma";
import { childrenVisibleToGuardian } from "@/lib/guardian/visibility";

export type GuardianChild = {
  id: string;
  name: string;
  degreeName: string;
};

/**
 * Solo estudiantes cuyo guardianId es exactamente el de la sesión.
 * No acepta un id enviado por el cliente.
 */
export async function listGuardianChildren(
  guardianId: string
): Promise<GuardianChild[]> {
  if (!guardianId) return [];

  const students = await prisma.student.findMany({
    where: { guardianId },
    select: {
      id: true,
      name: true,
      guardianId: true,
      degree: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  return childrenVisibleToGuardian(guardianId, students).map((student) => ({
    id: student.id,
    name: student.name,
    degreeName: student.degree.name,
  }));
}
