export const PERFORMANCES = ["S", "A", "B", "BJ"] as const;

export type Performance = (typeof PERFORMANCES)[number];

export const PERFORMANCE_LABELS: Record<Performance, string> = {
  S: "Superior",
  A: "Alto",
  B: "Básico",
  BJ: "Bajo",
};

export function isPerformance(value: string): value is Performance {
  return (PERFORMANCES as readonly string[]).includes(value);
}

export function performanceClass(performance: Performance) {
  switch (performance) {
    case "S":
      return "bg-success text-success-foreground";
    case "A":
      return "bg-info text-info-foreground";
    case "B":
      return "bg-warning text-warning-foreground";
    case "BJ":
      return "bg-destructive text-destructive-foreground";
  }
}

export function comparePerformance(a: Performance, b: Performance) {
  return PERFORMANCES.indexOf(a) - PERFORMANCES.indexOf(b);
}

export type BankSubject = { id: string; name: string };

export type BankAchievement = {
  id: string;
  content: string;
  subjectId: string;
  subjectName: string;
  performance: Performance;
};

export type BankObservation = {
  id: string;
  content: string;
  category: string | null;
};

export type PlanillaAchievement = {
  id: string;
  content: string;
  performance: Performance;
};

export type PlanillaObservation = {
  id: string;
  content: string;
  category: string | null;
};

export function appendBankPhrase(current: string, phrase: string) {
  const next = phrase.trim();
  if (!next) return current;
  const base = current.trim();
  if (!base) return next;
  const lines = base.split(/\n+/).map((line) => line.trim());
  if (lines.includes(next)) return current;
  return `${base}\n${next}`;
}
