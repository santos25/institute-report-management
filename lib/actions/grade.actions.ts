"use server";

import prisma from "@/db/prisma";

interface GradeData {
  studentId: string;
  subjectId: string;
  periodId: string;
  value: number;
  achievements?: string;
  observation?: string;
}

export async function saveGrades(grades: GradeData[]) {
  try {
    // Start a transaction for all operations
    return await prisma.$transaction(async (tx) => {
      const savedGrades = [];
      const savedObservations = [];

      // Get the first periodId from the batch (all should be the same)
      const periodId = grades[0]?.periodId;

      if (!periodId) {
        return {
          success: false,
          error: "No period ID provided",
        };
      }

      // Process each grade entry
      for (const grade of grades) {
        // Save the grade for this specific year's period
        const savedGrade = await tx.studentGrade.upsert({
          where: {
            studentId_subjectId_periodId: {
              studentId: grade.studentId,
              subjectId: grade.subjectId,
              periodId: grade.periodId,
            },
          },
          update: {
            grade: grade.value,
            achievements: grade.achievements,
          },
          create: {
            studentId: grade.studentId,
            subjectId: grade.subjectId,
            periodId: grade.periodId,
            grade: grade.value,
            achievements: grade.achievements,
          },
        });

        savedGrades.push(savedGrade);

        // If observation is provided, also save it
        if (grade.observation) {
          const savedObservation = await tx.studentObservation.upsert({
            where: {
              studentId_periodId: {
                studentId: grade.studentId,
                periodId: grade.periodId,
              },
            },
            update: {
              content: grade.observation,
            },
            create: {
              studentId: grade.studentId,
              periodId: grade.periodId,
              content: grade.observation,
            },
          });

          savedObservations.push(savedObservation);
        }
      }

      return {
        success: true,
        count: savedGrades.length,
        grades: savedGrades,
        observations: savedObservations,
      };
    });
  } catch (error) {
    console.error("Error saving grades and observations:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getGradesBySubjectAndPeriod(
  subjectId: string,
  periodId: string
) {
  try {
    const grades = await prisma.studentGrade.findMany({
      where: {
        subjectId,
        periodId,
      },
      include: {
        student: true,
      },
    });

    // Format the results as an object with studentId as the key for easy access
    const formattedGrades = grades.reduce((acc, grade) => {
      acc[grade.studentId] = {
        grade: grade.grade,
        id: grade.id,
      };
      return acc;
    }, {} as Record<string, { grade: number; id: string }>);

    return formattedGrades;
  } catch (error) {
    console.error("Error fetching grades by subject and period:", error);
    throw error;
  }
}

export async function getGradesByStudentAndPeriod(
  studentId: string,
  periodId: string
) {
  try {
    const grades = await prisma.studentGrade.findMany({
      where: {
        studentId,
        periodId,
      },
      include: {
        subject: true,
      },
    });

    return grades;
  } catch (error) {
    console.error("Error fetching grades:", error);
    throw error;
  }
}

export async function getGradesByDegreeAndPeriod(
  degreeId: string,
  periodId: string
) {
  try {
    const students = await prisma.student.findMany({
      where: {
        degreeId,
      },
      include: {
        grades: {
          where: {
            periodId,
          },
          include: {
            subject: true,
          },
        },
      },
    });

    return students;
  } catch (error) {
    console.error("Error fetching grades by degree and period:", error);
    throw error;
  }
}

export async function getGradesAndObservationsBySubjectPeriod(
  subjectId: string,
  periodId: string,
  degreeId: string
) {
  try {
    // First get the period to determine the year
    const period = await prisma.period.findUnique({
      where: {
        id: periodId,
      },
    });

    if (!period) {
      return {
        success: false,
        error: "Period not found",
      };
    }

    const periodYear = period.year;

    // Get all students in this degree
    const students = await prisma.student.findMany({
      where: {
        degreeId: degreeId,
      },
      orderBy: {
        name: "asc",
      },
    });

    const studentIds = students.map((student) => student.id);

    // Get all grades for these students in this subject and period
    // Filter by the year of the period
    const grades = await prisma.studentGrade.findMany({
      where: {
        studentId: {
          in: studentIds,
        },
        subjectId: subjectId,
        periodId: periodId,
        period: {
          year: periodYear,
        },
      },
    });

    // Get all observations for these students in this period
    // Also filter by the year of the period
    const observations = await prisma.studentObservation.findMany({
      where: {
        studentId: {
          in: studentIds,
        },
        periodId: periodId,
        period: {
          year: periodYear,
        },
      },
    });

    // Create a map of student ID to their grade, achievements, and observation
    const studentData = students.reduce(
      (acc, student) => {
        const grade = grades.find((g) => g.studentId === student.id);
        const observation = observations.find(
          (o) => o.studentId === student.id
        );

        acc[student.id] = {
          student: student,
          grade: grade ? grade.grade : 0,
          gradeId: grade ? grade.id : null,
          achievements: grade ? grade.achievements || "" : "",
          observation: observation ? observation.content : "",
          observationId: observation ? observation.id : null,
        };

        return acc;
      },
      {} as Record<
        string,
        {
          student: (typeof students)[0];
          grade: number;
          gradeId: string | null;
          achievements: string;
          observation: string;
          observationId: string | null;
        }
      >
    );

    return {
      success: true,
      data: studentData,
      year: periodYear,
    };
  } catch (error) {
    console.error("Error fetching grades and observations:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
