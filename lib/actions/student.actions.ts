"use server";

import prisma from "@/db/prisma";

export async function getStudentsByDegree(degreeId: string) {
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