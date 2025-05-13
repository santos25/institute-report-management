"use server";

import prisma from "@/db/prisma";

export async function getSubjectsByDegree(degreeId: string) {
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
