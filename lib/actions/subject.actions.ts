"use server";

import prisma from "@/db/prisma";
import { requireAuthOrThrow } from "@/lib/auth-helpers";

export async function getSubjectsByDegree(degreeId: string) {
  const session = await requireAuthOrThrow();

  // Authorization check
  if (session.user.role === "TEACHER") {
    if (!session.user.degreeIds.includes(degreeId)) {
      throw new Error("Forbidden: You don't have access to this degree");
    }
  }

  try {
    const subjects = await prisma.subject.findMany({
      where: {
        degrees: {
          some: {
            id: degreeId
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return subjects;
  } catch (error) {
    console.error("Error fetching subjects by degree:", error);
    throw error;
  }
}
