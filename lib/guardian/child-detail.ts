import { SUBJECT_HOURS_BY_GRADE } from "@/lib/constant";
import { GUARDIAN_ACCESS } from "@/lib/guardian/credentials";
import type { StudentReport } from "@/lib/actions/report.actions";
import { calculateDS } from "@/lib/utils";

export type ChildPerformance = {
  code: string;
  name: string;
};

export type ChildSubjectDetail = {
  id: string;
  name: string;
  grade: number;
  performance: ChildPerformance | null;
  achievements: string;
};

export type ChildPeriodDetail = {
  id: string;
  number: number;
  subjects: ChildSubjectDetail[];
  observation: string;
};

export type ChildDetail = {
  student: {
    id: string;
    name: string;
    degreeId: string;
    degreeName: string;
  };
  year: number;
  periods: ChildPeriodDetail[];
};

export type DetailStudent = {
  id: string;
  name: string;
  guardianId: string | null;
  degreeId: string;
  degreeName: string;
};

export type DetailPeriod = {
  id: string;
  number: number;
  year: number;
  published: boolean;
};

export type DetailGrade = {
  studentId: string;
  periodId: string;
  subjectId: string;
  subjectName: string;
  grade: number;
  achievements: string | null;
};

export type DetailObservation = {
  studentId: string;
  periodId: string;
  content: string;
};

const PERFORMANCE_NAMES: Record<string, string> = {
  BJ: "Bajo",
  B: "Básico",
  A: "Alto",
  S: "Superior",
};

export function childDetailAction(studentId: string) {
  return `${GUARDIAN_ACCESS.VIEW_CHILD}:${studentId}`;
}

export function childBoletinAction(studentId: string) {
  return `${GUARDIAN_ACCESS.VIEW_BOLETIN}:${studentId}`;
}

export function performanceForGrade(grade: number): ChildPerformance | null {
  const result = calculateDS(grade);
  const name = PERFORMANCE_NAMES[result.label];
  if (!name) return null;
  return { code: result.label, name };
}

function subjectRank(degreeName: string, subjectName: string) {
  const list =
    SUBJECT_HOURS_BY_GRADE[degreeName as keyof typeof SUBJECT_HOURS_BY_GRADE];
  if (!list) return Number.MAX_SAFE_INTEGER;
  const index = list.findIndex((item) => item.name === subjectName);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

/**
 * Arma el detalle de un solo hijo. Devuelve null si el estudiante no pertenece
 * al acudiente. Ignora otros años, periodos sin publicar, otros estudiantes y notas en cero.
 */
export function buildChildDetail(input: {
  guardianId: string;
  year: number;
  student: DetailStudent | null;
  periods: DetailPeriod[];
  grades: DetailGrade[];
  observations: DetailObservation[];
}): ChildDetail | null {
  const { guardianId, year, student } = input;
  if (!guardianId || !student || student.guardianId !== guardianId) return null;

  const periods = input.periods
    .filter((period) => period.year === year && period.published)
    .sort((a, b) => a.number - b.number);
  const periodIds = new Set(periods.map((period) => period.id));

  const periodDetails = periods.flatMap((period) => {
    const subjects = input.grades
      .filter(
        (grade) =>
          grade.studentId === student.id &&
          grade.periodId === period.id &&
          periodIds.has(grade.periodId) &&
          grade.grade > 0
      )
      .map((grade) => ({
        id: grade.subjectId,
        name: grade.subjectName,
        grade: grade.grade,
        performance: performanceForGrade(grade.grade),
        achievements: grade.achievements?.trim() ?? "",
      }))
      .sort((a, b) => {
        const rank = subjectRank(student.degreeName, a.name) - subjectRank(student.degreeName, b.name);
        return rank !== 0 ? rank : a.name.localeCompare(b.name, "es");
      });

    const observation =
      input.observations.find(
        (item) =>
          item.studentId === student.id &&
          item.periodId === period.id &&
          periodIds.has(item.periodId)
      )?.content.trim() ?? "";

    if (subjects.length === 0 && !observation) return [];

    return [
      {
        id: period.id,
        number: period.number,
        subjects,
        observation,
      },
    ];
  });

  return {
    student: {
      id: student.id,
      name: student.name,
      degreeId: student.degreeId,
      degreeName: student.degreeName,
    },
    year,
    periods: periodDetails,
  };
}

/** Misma forma que el boletín del personal, solo con los periodos ya filtrados. */
export function childDetailToReport(detail: ChildDetail): StudentReport {
  return {
    student: {
      id: detail.student.id,
      name: detail.student.name,
      degreeId: detail.student.degreeId,
    },
    periodGrades: detail.periods.map((period) => ({
      periodId: period.id,
      periodNumber: period.number,
      grades: period.subjects.map((subject) => ({
        subjectId: subject.id,
        subjectName: subject.name,
        grade: subject.grade,
        achievements: subject.achievements,
      })),
      observation: period.observation,
    })),
  };
}
