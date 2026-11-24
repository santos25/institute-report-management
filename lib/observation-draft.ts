/**
 * La observación común no tiene fila propia. Al abrir el grado se reconoce
 * como el texto no vacío que más se repite en StudentObservation. Si dos
 * textos empatan, o si el más repetido aparece una sola vez, no hay común:
 * cada texto queda como observación personalizada.
 */

export const OBSERVATIONS_NAV_ID = "observaciones-generales";

export type ObservationFilter = "todos" | "comun" | "personalizadas" | "vacia";

export type ObservationMode = "common" | "custom" | "empty";

export type ObservationStatus = "comun" | "personalizada" | "vacia";

export type ObservationStudent = {
  id: string;
  name: string;
  content: string;
};

export type ObservationRow = {
  studentId: string;
  name: string;
  mode: ObservationMode;
  customText: string;
  stored: string;
};

export type ObservationDraft = {
  commonText: string;
  rows: ObservationRow[];
};

export function normalizeObservation(value: string | null | undefined): string {
  return (value ?? "").trim();
}

export function deriveCommonObservation(contents: readonly string[]): string {
  const counts = new Map<string, number>();

  for (const content of contents) {
    const text = normalizeObservation(content);
    if (!text) continue;
    counts.set(text, (counts.get(text) ?? 0) + 1);
  }

  let best = "";
  let bestCount = 0;
  let tied = false;

  for (const [text, count] of counts) {
    if (count > bestCount) {
      best = text;
      bestCount = count;
      tied = false;
    } else if (count === bestCount) {
      tied = true;
    }
  }

  if (!best || tied || bestCount < 2) return "";
  return best;
}

export function createObservationDraft(
  students: readonly ObservationStudent[]
): ObservationDraft {
  const commonText = deriveCommonObservation(
    students.map((student) => student.content)
  );

  const rows = students.map((student) => {
    const stored = normalizeObservation(student.content);

    if (commonText && stored === commonText) {
      return {
        studentId: student.id,
        name: student.name,
        mode: "common" as const,
        customText: "",
        stored,
      };
    }

    if (stored) {
      return {
        studentId: student.id,
        name: student.name,
        mode: "custom" as const,
        customText: stored,
        stored,
      };
    }

    return {
      studentId: student.id,
      name: student.name,
      mode: "empty" as const,
      customText: "",
      stored: "",
    };
  });

  return { commonText, rows };
}

export function cloneObservationDraft(draft: ObservationDraft): ObservationDraft {
  return {
    commonText: draft.commonText,
    rows: draft.rows.map((row) => ({ ...row })),
  };
}

export function effectiveObservation(
  row: ObservationRow,
  commonText: string
): string {
  if (row.mode === "common") return normalizeObservation(commonText);
  if (row.mode === "custom") return normalizeObservation(row.customText);
  return "";
}

export function observationStatus(
  row: ObservationRow,
  commonText: string
): ObservationStatus {
  if (!effectiveObservation(row, commonText)) return "vacia";
  if (row.mode === "common") return "comun";
  return "personalizada";
}

export function countUsingCommon(
  rows: readonly ObservationRow[],
  commonText: string
): number {
  if (!normalizeObservation(commonText)) return 0;
  return rows.filter((row) => observationStatus(row, commonText) === "comun")
    .length;
}

export function countWithObservation(
  rows: readonly ObservationRow[],
  commonText: string
): number {
  return rows.filter((row) => effectiveObservation(row, commonText) !== "")
    .length;
}

/**
 * Si el grado no tenía observación común al abrirlo, el primer texto que se
 * escribe pasa a cubrir a quienes estaban sin observación. No toca a quienes
 * ya tienen una personalizada, ni rellena huecos cuando la común ya existía.
 */
export function applyCommonText(
  rows: readonly ObservationRow[],
  previousCommon: string,
  nextCommon: string,
  baselineCommon: string
): ObservationRow[] {
  const baselineEmpty = normalizeObservation(baselineCommon) === "";
  const wasEmpty = normalizeObservation(previousCommon) === "";
  const now = normalizeObservation(nextCommon);

  if (!baselineEmpty || !wasEmpty || !now) return [...rows];

  return rows.map((row) =>
    row.mode === "empty" ? { ...row, mode: "common", customText: "" } : { ...row }
  );
}

export function personalizeRow(
  row: ObservationRow,
  commonText: string
): ObservationRow {
  return {
    ...row,
    mode: "custom",
    customText: row.mode === "common" ? commonText : row.customText,
  };
}

export function linkRowToCommon(row: ObservationRow): ObservationRow {
  return { ...row, mode: "common", customText: "" };
}

export function matchesObservationFilter(
  row: ObservationRow,
  commonText: string,
  filter: ObservationFilter
): boolean {
  if (filter === "todos") return true;
  const status = observationStatus(row, commonText);
  if (filter === "personalizadas") return status === "personalizada";
  return status === filter;
}

/** Estudiantes ligados a la común cuya fila va a cambiar porque el texto cambió. */
export function commonUpdateCount(
  rows: readonly ObservationRow[],
  baselineCommon: string,
  commonText: string
): number {
  const next = normalizeObservation(commonText);
  if (normalizeObservation(baselineCommon) === next) return 0;
  return rows.filter((row) => row.mode === "common" && row.stored !== next)
    .length;
}

export function changedObservations(
  rows: readonly ObservationRow[],
  commonText: string
): { studentId: string; content: string }[] {
  const changes: { studentId: string; content: string }[] = [];

  for (const row of rows) {
    const content = effectiveObservation(row, commonText);
    if (content !== row.stored) {
      changes.push({ studentId: row.studentId, content });
    }
  }

  return changes;
}

export function markObservationSaved(
  rows: readonly ObservationRow[],
  commonText: string
): ObservationRow[] {
  return rows.map((row) => {
    const stored = effectiveObservation(row, commonText);
    if (row.mode === "custom" && !stored) {
      return { ...row, mode: "empty", customText: "", stored: "" };
    }
    return { ...row, stored };
  });
}

export function observationChangeCount(
  rows: readonly ObservationRow[],
  commonText: string
): number {
  return changedObservations(rows, commonText).length;
}
