import prisma from "@/db/prisma";
import { SUBJECT_HOURS_BY_GRADE } from "@/lib/constant";
import { getActiveSchoolYear } from "@/lib/school-year";
import { sortDegrees } from "@/lib/utils";

export type PeriodOption = {
  id: string;
  number: number;
  year: number;
  visibleToGuardians: boolean;
};

export type SubjectProgress = {
  id: string;
  name: string;
  filled: number;
  total: number;
  complete: boolean;
};

export type DegreeProgress = {
  id: string;
  name: string;
  studentCount: number;
  filled: number;
  expected: number;
  percent: number;
  complete: boolean;
  pendingSubjects: number;
  subjects: SubjectProgress[];
};

export type ProgressSummary = {
  percent: number;
  filled: number;
  expected: number;
  degreesComplete: number;
  degreeCount: number;
  subjectsPending: number;
};

export type PeriodProgress = {
  year: number;
  periods: PeriodOption[];
  period: PeriodOption | null;
  summary: ProgressSummary;
  degrees: DegreeProgress[];
};

const EMPTY_SUMMARY: ProgressSummary = {
  percent: 0,
  filled: 0,
  expected: 0,
  degreesComplete: 0,
  degreeCount: 0,
  subjectsPending: 0,
};

/** Share of entered grades. An empty denominator is 0%, not a finished planilla. */
export function progressPercent(filled: number, expected: number): number {
  if (expected <= 0) return 0;
  const rounded = Math.round((Math.min(filled, expected) / expected) * 100);
  return Math.min(100, Math.max(0, rounded));
}

function subjectRank(degreeName: string, subjectName: string): number {
  const list =
    SUBJECT_HOURS_BY_GRADE[degreeName as keyof typeof SUBJECT_HOURS_BY_GRADE];
  if (!list) return Number.MAX_SAFE_INTEGER;
  const index = list.findIndex((item) => item.name === subjectName);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function compareSubjects(degreeName: string, a: string, b: string): number {
  const rankA = subjectRank(degreeName, a);
  const rankB = subjectRank(degreeName, b);
  if (rankA !== rankB) return rankA - rankB;
  return a.localeCompare(b, "es");
}

export function planillaHref(degreeId: string, periodId: string): string {
  const params = new URLSearchParams({
    grado: degreeId,
    periodo: periodId,
  });
  return `/planillas?${params.toString()}`;
}

/**
 * Read-only snapshot of how many grades are entered for one period.
 * Two queries: degrees (with their students and subjects) and one
 * StudentGrade groupBy. Aggregation stays in memory so shared subjects
 * are counted per degree instead of across the school.
 */
export async function getPeriodProgress(
  periodId?: string
): Promise<PeriodProgress> {
  const year = getActiveSchoolYear();

  const periods = await prisma.period.findMany({
    where: { year },
    orderBy: { number: "asc" },
    select: { id: true, number: true, year: true, visibleToGuardians: true },
  });

  const period =
    periods.find((item) => item.id === periodId) ?? periods[0] ?? null;

  if (!period) {
    return {
      year,
      periods,
      period: null,
      summary: EMPTY_SUMMARY,
      degrees: [],
    };
  }

  const [degreeRows, gradeGroups] = await Promise.all([
    prisma.degree.findMany({
      select: {
        id: true,
        name: true,
        subjects: { select: { id: true, name: true } },
        students: { select: { id: true } },
      },
    }),
    prisma.studentGrade.groupBy({
      by: ["studentId", "subjectId"],
      where: {
        periodId: period.id,
        grade: { gte: 1, lte: 5 },
      },
      _count: { _all: true },
    }),
  ]);

  const filledKeys = new Set(
    gradeGroups.map((row) => `${row.studentId}:${row.subjectId}`)
  );

  const degrees = sortDegrees(
    degreeRows.map((degree) => {
      const studentIds = degree.students.map((student) => student.id);
      const total = studentIds.length;
      const subjects = [...degree.subjects]
        .sort((a, b) => compareSubjects(degree.name, a.name, b.name))
        .map((subject) => {
          let filled = 0;
          for (const studentId of studentIds) {
            if (filledKeys.has(`${studentId}:${subject.id}`)) filled += 1;
          }
          return {
            id: subject.id,
            name: subject.name,
            filled,
            total,
            complete: total > 0 && filled >= total,
          };
        });

      const filled = subjects.reduce((sum, subject) => sum + subject.filled, 0);
      const expected = total * subjects.length;
      const pendingSubjects = subjects.filter(
        (subject) => subject.total > 0 && !subject.complete
      ).length;

      return {
        id: degree.id,
        name: degree.name,
        studentCount: total,
        filled,
        expected,
        percent: progressPercent(filled, expected),
        complete: expected > 0 && pendingSubjects === 0,
        pendingSubjects,
        subjects,
      };
    })
  );

  const filled = degrees.reduce((sum, degree) => sum + degree.filled, 0);
  const expected = degrees.reduce((sum, degree) => sum + degree.expected, 0);

  return {
    year,
    periods,
    period,
    summary: {
      percent: progressPercent(filled, expected),
      filled,
      expected,
      degreesComplete: degrees.filter((degree) => degree.complete).length,
      degreeCount: degrees.length,
      subjectsPending: degrees.reduce(
        (sum, degree) => sum + degree.pendingSubjects,
        0
      ),
    },
    degrees,
  };
}
