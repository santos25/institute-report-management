import Link from "next/link";
import type { ChildDetail, ChildPerformance } from "@/lib/guardian/child-detail";

function formatGrade(grade: number) {
  return grade.toLocaleString("es-CO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

const PERFORMANCE_CLASS: Record<string, string> = {
  BJ: "bg-coral-100 text-coral-800",
  B: "bg-sol-100 text-sol-800",
  A: "bg-azul-100 text-azul-800",
  S: "bg-lila-100 text-lila-800",
};

function PerformanceBadge({ performance }: { performance: ChildPerformance }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${PERFORMANCE_CLASS[performance.code] ?? "bg-crema-100 text-tinta"}`}
    >
      {performance.code} · {performance.name}
    </span>
  );
}

export default function ChildDetailView({ detail }: { detail: ChildDetail }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <Link
        href="/familias"
        className="text-sm font-semibold text-azul-700 underline-offset-4 hover:underline"
      >
        Volver a tus hijos
      </Link>
      <h1 className="mt-3 font-display text-2xl font-semibold text-tinta">
        {detail.student.name}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {detail.student.degreeName} · Año {detail.year}
      </p>

      {detail.periods.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-border bg-card px-4 py-6 text-sm text-tinta">
          El colegio todavía no ha registrado notas ni observaciones de este año.
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {detail.periods.map((period) => (
            <section
              key={period.id}
              className="rounded-2xl border border-border bg-card px-4 py-4"
            >
              <h2 className="font-display text-lg font-semibold text-tinta">
                Periodo {period.number}
              </h2>

              {period.subjects.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Este periodo no tiene notas registradas.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {period.subjects.map((subject) => (
                    <li
                      key={subject.id}
                      className="rounded-xl bg-crema-50 px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-tinta">{subject.name}</p>
                        <p className="font-display text-xl font-semibold text-tinta">
                          {formatGrade(subject.grade)}
                        </p>
                      </div>
                      {subject.performance ? (
                        <div className="mt-2">
                          <PerformanceBadge performance={subject.performance} />
                        </div>
                      ) : null}
                      {subject.achievements ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-tinta">
                          <span className="font-semibold">Logros. </span>
                          {subject.achievements}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}

              {period.observation ? (
                <div className="mt-4 border-t border-border pt-3">
                  <h3 className="text-sm font-semibold text-tinta">
                    Observación general
                  </h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-tinta">
                    {period.observation}
                  </p>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
