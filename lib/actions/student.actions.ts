"use server";

import prisma from "@/db/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function getStudentsByDegree(degreeId: string) {
  const session = await requireAuth();

  // Authorization check
  if (session.user.role === "TEACHER") {
    if (!session.user.degreeIds.includes(degreeId)) {
      throw new Error("Forbidden: You don't have access to this degree");
    }
  }

  try {
    const students = await prisma.student.findMany({
      where: {
        degreeId: degreeId
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return students;
  } catch (error) {
    console.error("Error fetching students by degree:", error);
    throw error;
  }
} 