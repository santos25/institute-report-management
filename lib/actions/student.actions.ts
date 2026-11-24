"use server";

import prisma from "@/db/prisma";
import { assertDegreeAccess, requireActionUser } from "@/lib/auth/access";

export async function getStudentsByDegree(degreeId: string) {
  try {
    const user = await requireActionUser();
    assertDegreeAccess(user, degreeId);

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