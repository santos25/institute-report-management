import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { StudentReport } from "./actions/report.actions";
import { Degree } from "@prisma/client";
import {
  FormattedStudentReport,
  SubjectData,
} from "@/components/shared/boletines/ReportsTable";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateFinalGrade = (
  subject: SubjectData,
  periodNumbers: number[]
): string => {
  let sum = 0;
  let count = 0;
  periodNumbers.forEach((period) => {
    if (subject.periods[period]) {
      sum += subject.periods[period].grade;
      count++;
    }
  });
  return count > 0 ? (sum / count).toFixed(1) : "N/A";
};

export const formatStudentReport = (
  reportData: StudentReport,
  degrees: Degree[]
): FormattedStudentReport => {
  const degree = degrees.find((d) => d.id === reportData.student.degreeId);

  // Get all unique subjects across all periods
  const allSubjects = new Map<string, SubjectData>();
  reportData.periodGrades.forEach((periodData) => {
    periodData.grades.forEach((grade) => {
      if (grade.grade > 0) {
        // Only consider subjects with grades
        if (!allSubjects.has(grade.subjectId)) {
          allSubjects.set(grade.subjectId, {
            id: grade.subjectId,
            name: grade.subjectName,
            periods: {},
          });
        }
        // Store grade and achievements for this subject and period
        allSubjects.get(grade.subjectId)!.periods[periodData.periodNumber] = {
          grade: grade.grade,
          achievements: grade.achievements,
        };
      }
    });
  });

  // Sort periods for consistent display
  const periodNumbers = [
    ...new Set(reportData.periodGrades.map((p) => p.periodNumber)),
  ].sort();

  // Get the last period number for achievements
  const lastPeriodNumber = Math.max(...periodNumbers);

  // Get all observations organized by period
  const observations = reportData.periodGrades.reduce((acc, periodData) => {
    acc[periodData.periodNumber] = periodData.observation;
    return acc;
  }, {} as Record<number, string>);

  return {
    student: reportData.student,
    degree,
    periodNumbers,
    lastPeriodNumber,
    subjects: Array.from(allSubjects.values()),
    observations,
  };
};
