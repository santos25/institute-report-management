import { SUBJECT_HOURS_BY_GRADE } from "@/lib/constant";
import { calculateDS } from "@/lib/utils";

export const ANNUAL_PERIOD_NUMBERS = [1, 2, 3, 4] as const;

export type AnnualStatus = "aprobado" | "pendiente" | "en_riesgo";

export type AnnualGradeInput = {
  studentId: string;
  subjectId: string;
  periodNumber: number;
  grade: number;
};

export type AnnualSubjectRow = {
  id: string;
  name: string;
  hours: number | null;
  periods: Record<number, number | null>;
  definitive: number | null;
  performanceLabel: string;
  performanceClass: string;
  missingPeriods: number[];
};

export type AnnualPeriodCoverage = {
  period: number;
  gradedSubjects: number;
  totalSubjects: number;
};

export type AnnualStudentBulletin = {
  student: {
    id: string;
    name: string;
    degreeId: string;
  };
  subjects: AnnualSubjectRow[];
  generalAverage: number | null;
  generalPerformanceLabel: string;
  generalPerformanceClass: string;
  status: AnnualStatus;
  statusLabel: string;
  statusReason: string;
  periodCoverage: AnnualPeriodCoverage[];
  bajoSubjects: string[];
};

export type AnnualDegreeReport = {
  year: number;
  degree: {
    id: string;
    name: string;
  };
  periodsOnRecord: number[];
  students: AnnualStudentBulletin[];
};

/**
 * Redondeo half-up a 1 decimal.
 * Sumar una fracción mínima evita que 3.55 o 3.65 queden por debajo
 * del corte por la representación binaria (3.55 * 10 ≈ 35.499999).
 */
export function roundToOneDecimal(value: number): number {
  if (!Number.isFinite(value)) return value;
  const negative = value < 0;
  const rounded = Math.round(Math.abs(value) * 10 + 1e-8);
  const result = rounded / 10;
  return negative ? -result : result;
}

export function formatGrade(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toFixed(1);
}

export function annualStatusClass(status: AnnualStatus): string {
  if (status === "aprobado") return "bg-success text-success-foreground";
  if (status === "pendiente") return "bg-warning text-warning-foreground";
  return "bg-destructive text-destructive-foreground";
}

/** Promedio de los valores presentes, redondeado a 1 decimal. */
export function averagePresentGrades(values: Array<number | null>): number | null {
  const present = values.filter(
    (value): value is number => value != null && value > 0
  );
  if (present.length === 0) return null;
  const sum = present.reduce((total, value) => total + value, 0);
  return roundToOneDecimal(sum / present.length);
}

function hoursForSubject(subjectName: string, degreeName: string): number | null {
  const subjectHours =
    SUBJECT_HOURS_BY_GRADE[degreeName as keyof typeof SUBJECT_HOURS_BY_GRADE];
  if (!subjectHours) return null;
  const match = subjectHours.find((subject) => subject.name === subjectName);
  return match ? match.hours : null;
}

function sortSubjects<T extends { name: string }>(
  subjects: T[],
  degreeName: string
): T[] {
  const order =
    SUBJECT_HOURS_BY_GRADE[degreeName as keyof typeof SUBJECT_HOURS_BY_GRADE] ??
    [];
  const orderMap = new Map(order.map((subject, index) => [subject.name, index]));

  return [...subjects].sort((a, b) => {
    const orderA = orderMap.get(a.name) ?? 999;
    const orderB = orderMap.get(b.name) ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name, "es");
  });
}

function sentence(text: string): string {
  const trimmed = text.trim().replace(/\.+$/, "");
  if (!trimmed) return "";
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}.`;
}

function paragraph(parts: Array<string | false | null | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part))
    .map(sentence)
    .join(" ");
}

function joinSpanish(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function performanceOf(grade: number | null) {
  if (grade == null) {
    return { label: "", color: "" };
  }
  const result = calculateDS(grade);
  return { label: result.label, color: result.color };
}

function resolveStatus(input: {
  subjects: AnnualSubjectRow[];
  generalAverage: number | null;
  periodsOnRecord: number[];
}): Pick<
  AnnualStudentBulletin,
  "status" | "statusLabel" | "statusReason" | "bajoSubjects"
> {
  const bajoSubjects = input.subjects
    .filter((subject) => subject.performanceLabel === "BJ")
    .map((subject) => subject.name);
  const outOfScale = input.subjects.filter(
    (subject) => subject.definitive != null && subject.performanceLabel === ""
  );
  const withGaps = input.subjects.filter(
    (subject) => subject.missingPeriods.length > 0
  );
  const anyGrade = input.subjects.some((subject) => subject.definitive != null);
  const averageLow =
    input.generalAverage != null && input.generalAverage < 3;
  const missingYearPeriods = ANNUAL_PERIOD_NUMBERS.filter(
    (period) => !input.periodsOnRecord.includes(period)
  );

  const gapText = (() => {
    if (input.subjects.length === 0) {
      return "Este grado no tiene materias registradas";
    }
    if (withGaps.length === 0) return "";
    if (!anyGrade) {
      return "No hay notas registradas en los periodos 1, 2, 3 y 4";
    }
    if (withGaps.length === input.subjects.length) {
      return "Faltan notas de uno o más periodos en todas las materias";
    }
    const noun = withGaps.length === 1 ? "materia" : "materias";
    return `Faltan notas de uno o más periodos en ${withGaps.length} ${noun}`;
  })();

  const yearText =
    missingYearPeriods.length > 0
      ? `El año no tiene el periodo ${joinSpanish(
          missingYearPeriods.map(String)
        )}`
      : "";

  const averageRule =
    anyGrade && withGaps.length > 0
      ? "La definitiva y el promedio usan solo los periodos con nota"
      : "";

  if (bajoSubjects.length > 0 || averageLow) {
    return {
      status: "en_riesgo",
      statusLabel: "En riesgo",
      bajoSubjects,
      statusReason: paragraph([
        bajoSubjects.length > 0 &&
          `Desempeño Bajo en ${joinSpanish(bajoSubjects)}`,
        averageLow &&
          input.generalAverage != null &&
          `El promedio general (${formatGrade(input.generalAverage)}) es menor a 3.0`,
        gapText,
        yearText,
        averageRule,
      ]),
    };
  }

  if (
    withGaps.length > 0 ||
    input.generalAverage == null ||
    outOfScale.length > 0 ||
    missingYearPeriods.length > 0
  ) {
    return {
      status: "pendiente",
      statusLabel: "Pendiente",
      bajoSubjects,
      statusReason: paragraph([
        gapText,
        yearText,
        outOfScale.length > 0 &&
          `Hay notas fuera de la escala 1.0 a 5.0 en ${joinSpanish(
            outOfScale.map((subject) => subject.name)
          )}`,
        averageRule ||
          (input.generalAverage == null &&
            "Sin notas no hay definitiva ni promedio general"),
      ]),
    };
  }

  return {
    status: "aprobado",
    statusLabel: "Aprobado",
    bajoSubjects,
    statusReason:
      "Los 4 periodos tienen nota, ninguna materia está en Bajo y el promedio general es de 3.0 o más.",
  };
}

export function buildAnnualDegreeReport(input: {
  year: number;
  degree: { id: string; name: string };
  subjects: { id: string; name: string }[];
  students: { id: string; name: string; degreeId: string }[];
  periodsOnRecord: number[];
  grades: AnnualGradeInput[];
}): AnnualDegreeReport {
  const periodsOnRecord = ANNUAL_PERIOD_NUMBERS.filter((period) =>
    input.periodsOnRecord.includes(period)
  );
  const orderedSubjects = sortSubjects(input.subjects, input.degree.name);

  const gradesByStudent = new Map<string, Map<string, Map<number, number>>>();
  for (const grade of input.grades) {
    if (!ANNUAL_PERIOD_NUMBERS.includes(grade.periodNumber as 1 | 2 | 3 | 4)) {
      continue;
    }
    if (!(grade.grade > 0)) continue;

    let bySubject = gradesByStudent.get(grade.studentId);
    if (!bySubject) {
      bySubject = new Map();
      gradesByStudent.set(grade.studentId, bySubject);
    }
    let byPeriod = bySubject.get(grade.subjectId);
    if (!byPeriod) {
      byPeriod = new Map();
      bySubject.set(grade.subjectId, byPeriod);
    }
    byPeriod.set(grade.periodNumber, grade.grade);
  }

  const students = input.students.map((student) => {
    const bySubject = gradesByStudent.get(student.id);
    const subjects: AnnualSubjectRow[] = orderedSubjects.map((subject) => {
      const byPeriod = bySubject?.get(subject.id);
      const periods: Record<number, number | null> = {};
      const present: number[] = [];
      const missingPeriods: number[] = [];

      for (const period of ANNUAL_PERIOD_NUMBERS) {
        const value = byPeriod?.get(period);
        if (value != null && value > 0) {
          periods[period] = value;
          present.push(value);
        } else {
          periods[period] = null;
          missingPeriods.push(period);
        }
      }

      const definitive = averagePresentGrades(present);
      const performance = performanceOf(definitive);

      return {
        id: subject.id,
        name: subject.name,
        hours: hoursForSubject(subject.name, input.degree.name),
        periods,
        definitive,
        performanceLabel: performance.label,
        performanceClass: performance.color,
        missingPeriods,
      };
    });

    const generalAverage = averagePresentGrades(
      subjects.map((subject) => subject.definitive)
    );
    const generalPerformance = performanceOf(generalAverage);
    const status = resolveStatus({
      subjects,
      generalAverage,
      periodsOnRecord,
    });

    return {
      student,
      subjects,
      generalAverage,
      generalPerformanceLabel: generalPerformance.label,
      generalPerformanceClass: generalPerformance.color,
      periodCoverage: ANNUAL_PERIOD_NUMBERS.map((period) => ({
        period,
        gradedSubjects: subjects.filter((subject) => subject.periods[period] != null)
          .length,
        totalSubjects: subjects.length,
      })),
      ...status,
    };
  });

  return {
    year: input.year,
    degree: input.degree,
    periodsOnRecord: [...periodsOnRecord],
    students,
  };
}
