export type GradeSnapshot = {
  grades: Record<string, string>;
  achievements: Record<string, string>;
};

export const EMPTY_GRADE_SNAPSHOT: GradeSnapshot = {
  grades: {},
  achievements: {},
};

export function cloneSnapshot(snapshot: GradeSnapshot): GradeSnapshot {
  return {
    grades: { ...snapshot.grades },
    achievements: { ...snapshot.achievements },
  };
}

export function countFieldChanges(
  current: GradeSnapshot,
  baseline: GradeSnapshot,
  studentIds: string[]
): number {
  let changes = 0;

  for (const studentId of studentIds) {
    if ((current.grades[studentId] ?? "") !== (baseline.grades[studentId] ?? "")) {
      changes += 1;
    }
    if (
      (current.achievements[studentId] ?? "") !==
      (baseline.achievements[studentId] ?? "")
    ) {
      changes += 1;
    }
  }

  return changes;
}

/** A stored grade counts only inside the scale the planilla accepts (1.0–5.0). */
export function hasEnteredGrade(value: string | undefined): boolean {
  const raw = (value ?? "").trim();
  if (!raw) return false;
  const numeric = Number(raw);
  return Number.isFinite(numeric) && numeric >= 1 && numeric <= 5;
}

export function countStudentsWithGrade(
  grades: Record<string, string>,
  studentIds: string[]
): number {
  let count = 0;
  for (const studentId of studentIds) {
    if (hasEnteredGrade(grades[studentId])) count += 1;
  }
  return count;
}

export function formatSubjectProgress(
  filled: number | null,
  total: number,
  status: "loading" | "ready" | "error"
): string {
  if (filled == null) {
    return status === "error" ? `–/${total}` : `…/${total}`;
  }
  return `${filled}/${total}`;
}

export function isSubjectComplete(filled: number | null, total: number): boolean {
  return filled != null && total > 0 && filled >= total;
}

export type SaveBarState =
  | { kind: "saving" }
  | { kind: "error" }
  | { kind: "dirty"; changeCount: number }
  | { kind: "saved"; savedAt: Date }
  | { kind: "clean" };

export function resolveSaveBarState(input: {
  saving: boolean;
  saveError: boolean;
  changeCount: number;
  savedAt: Date | null;
}): SaveBarState {
  if (input.saving) return { kind: "saving" };
  if (input.saveError) return { kind: "error" };
  if (input.changeCount > 0) {
    return { kind: "dirty", changeCount: input.changeCount };
  }
  if (input.savedAt) return { kind: "saved", savedAt: input.savedAt };
  return { kind: "clean" };
}

export function formatBogotaTime(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  return `${hour}:${minute}`;
}

export function getSaveBarLabel(state: SaveBarState): string {
  switch (state.kind) {
    case "saving":
      return "Guardando…";
    case "error":
      return "Error al guardar";
    case "dirty":
      return state.changeCount === 1
        ? "1 cambio sin guardar"
        : `${state.changeCount} cambios sin guardar`;
    case "saved":
      return `Guardado a las ${formatBogotaTime(state.savedAt)}`;
    case "clean":
      return "Sin cambios";
  }
}
