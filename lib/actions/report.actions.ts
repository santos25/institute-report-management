"use server";

import prisma from "@/db/prisma";

export interface StudentReport {
  student: {
    id: string;
    name: string;
    degreeId: string;
  };
  periodGrades: {
    periodId: string;
    periodNumber: number;
    grades: {
      subjectId: string;
      subjectName: string;
      grade: number;
      achievements: string;
    }[];
    observation: string;
  }[];
}

export async function getStudentReportsByDegreeAndYear(
  degreeId: string,
  year: string
): Promise<StudentReport[]> {
  try {
    // Convert year to integer
    const yearInt = parseInt(year);
    
    // Get all periods for the selected year
    const periods = await prisma.period.findMany({
      where: {
        year: yearInt,
      },
      orderBy: {
        number: 'asc',
      },
    });

    if (periods.length === 0) {
      throw new Error("No periods found for the selected year");
    }

    // First get all students from the degree
    const students = await prisma.student.findMany({
      where: {
        degreeId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    if (students.length === 0) {
      return [];
    }

    // Get all subjects for this degree
    const subjects = await prisma.subject.findMany({
      where: {
        degrees: {
          some: {
            id: degreeId,
          },
        },
      },
    });

    // For each student, get all their grades and observations for all periods
    const studentReports: StudentReport[] = [];

    for (const student of students) {
      const periodGrades = [];

      // For each period, get the grades and observation
      for (const period of periods) {
        // Get all grades for this student in this period
        const grades = await prisma.studentGrade.findMany({
          where: {
            studentId: student.id,
            periodId: period.id,
          },
          include: {
            subject: true,
          },
        });

        // Get the observation for this student in this period
        const observation = await prisma.studentObservation.findUnique({
          where: {
            studentId_periodId: {
              studentId: student.id,
              periodId: period.id,
            },
          },
        });

        // Format grades data
        const formattedGrades = grades.map((grade) => ({
          subjectId: grade.subjectId,
          subjectName: grade.subject.name,
          grade: grade.grade,
          achievements: grade.achievements || "",
        }));

        // Add placeholders for subjects without grades
        const allSubjectsGrades = subjects.map((subject) => {
          const existingGrade = formattedGrades.find(
            (g) => g.subjectId === subject.id
          );
          if (existingGrade) {
            return existingGrade;
          }
          return {
            subjectId: subject.id,
            subjectName: subject.name,
            grade: 0,
            achievements: "",
          };
        });

        // Only add period data if there are grades or observations
        if (grades.length > 0 || observation) {
          periodGrades.push({
            periodId: period.id,
            periodNumber: period.number,
            grades: allSubjectsGrades,
            observation: observation?.content || "",
          });
        }
      }

      // Only include students who have at least one period with data
      if (periodGrades.length > 0) {
        studentReports.push({
          student: {
            id: student.id,
            name: student.name,
            degreeId: student.degreeId,
          },
          periodGrades,
        });
      }
    }

    return studentReports;
  } catch (error) {
    console.error("Error fetching student reports:", error);
    throw error;
  }
} 