import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { StudentReport } from "./actions/report.actions";
import { Degree } from "@prisma/client";
import {
  FormattedStudentReport,
  SubjectData,
} from "@/components/shared/boletines/ReportsTable";
import { SUBJECT_HOURS_BY_GRADE } from "./constant";

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

export const getHourBySubjectAndDegree = (
  subjectName: string,
  degreeName: string
) => {
  const subjectHours =
    SUBJECT_HOURS_BY_GRADE[degreeName as keyof typeof SUBJECT_HOURS_BY_GRADE];
  const subject = subjectHours.find((s) => s.name === subjectName);
  return subject?.hours;
};

// Function to calculate DS (Desempeño) based on grade
export const calculateDS = (grade: string | number) => {
  const numericGrade = typeof grade === "string" ? parseFloat(grade) : grade;

  if (isNaN(numericGrade) || numericGrade === 0) {
    return { label: "", variant: "secondary" as const, color: "" };
  }

  if (numericGrade >= 1.0 && numericGrade <= 2.9) {
    return {
      label: "BJ",
      variant: "destructive" as const,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
  } else if (numericGrade >= 3.0 && numericGrade <= 3.9) {
    return {
      label: "B",
      variant: "secondary" as const,
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
  } else if (numericGrade >= 4.0 && numericGrade <= 4.5) {
    return {
      label: "A",
      variant: "default" as const,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };
  } else if (numericGrade >= 4.6 && numericGrade <= 5.0) {
    return {
      label: "S",
      variant: "default" as const,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
  }

  return { label: "", variant: "secondary" as const, color: "" };
};

// Function to sort subjects in the specified order
export const sortDegrees = (degrees: Degree[]) => {
  const order = [
    "Párvulo",
    "Pre Jardín",
    "Jardín",
    "Transición",
    "Primero",
    "Segundo",
    "Tercero",
    "Cuarto",
    "Quinto",
  ];

  return degrees.sort((a, b) => {
    const indexA = order.indexOf(a.name);
    const indexB = order.indexOf(b.name);

    // If both subjects are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one is in the order array, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // If neither is in the order array, sort alphabetically
    return a.name.localeCompare(b.name);
  });
};
