import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { planillaHref, type PeriodProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const numberFormat = new Intl.NumberFormat("es-CO");

function formatNumber(value: number): string {
  return numberFormat.format(value);
}

function studentLabel(count: number): string {
  if (count === 1) return "1 estudiante";
  return `${formatNumber(count)} estudiantes`;
}

function pendingLabel(count: number): string {
  if (count === 0) return "Todas las materias completas";
  if (count === 1) return "1 materia pendiente";
  return `${formatNumber(count)} materias pendientes`;
}

export default function PeriodProgressBoard({
  progress,
}: {
  progress: PeriodProgress;
}) {
  const { year, periods, period, summary, degrees } = progress;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-tinta">
            Avance del periodo
          </h1>
          <p className="mt-1 text-sm text-tinta-600">
            Notas diligenciadas en {year}. Elige un periodo para ver cada grado.
          </p>
        </div>

        {periods.length > 0 && (
          <nav aria-label="Periodo" className="flex flex-wrap gap-2">
            {periods.map((item) => {
              const active = item.id === period?.id;
              return (
                <Link
                  key={item.id}
                  href={`/avance?periodo=${item.id}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-azul-500 font-medium text-white"
                      : "border border-border bg-card text-tinta-600 hover:bg-azul-50 hover:text-azul-700"
                  )}
                >
                  Periodo {item.number}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {!period ? (
        <Card className="mt-6">
          <CardContent>
            <p className="text-sm text-tinta-600">
              No hay periodos registrados para {year}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <section
            aria-label="Resumen del periodo"
            className="mt-6 grid grid-cols-3 gap-2 sm:gap-3"
          >
            <SummaryStat
              value={`${summary.percent}%`}
              label="Notas diligenciadas"
              detail={`${formatNumber(summary.filled)} de ${formatNumber(summary.expected)}`}
            />
            <SummaryStat
              value={`${summary.degreesComplete} de ${summary.degreeCount}`}
              label="Grados al 100%"
            />
            <SummaryStat
              value={formatNumber(summary.subjectsPending)}
              label="Materias por completar"
            />
          </section>

          {degrees.length === 0 ? (
            <Card className="mt-6">
              <CardContent>
                <p className="text-sm text-tinta-600">No hay grados cargados.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {degrees.map((degree) => (
                <Card key={degree.id} className="gap-4 py-5">
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="font-display text-xl font-semibold text-tinta">
                          {degree.name}
                        </h2>
                        <p className="mt-1 text-sm text-tinta-600">
                          {studentLabel(degree.studentCount)}
                          <span aria-hidden> · </span>
                          {degree.subjects.length === 0
                            ? "Sin materias"
                            : pendingLabel(degree.pendingSubjects)}
                        </p>
                      </div>
                      <p className="font-display text-2xl font-semibold tabular-nums text-tinta">
                        {degree.percent}%
                      </p>
                    </div>

                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={degree.percent}
                      aria-label={`Avance de ${degree.name}`}
                    >
                      <div
                        className={cn(
                          "h-full rounded-full motion-safe:transition-[width]",
                          degree.complete ? "bg-hoja-500" : "bg-azul-500"
                        )}
                        style={{ width: `${degree.percent}%` }}
                      />
                    </div>

                    {degree.subjects.length === 0 ? (
                      <p className="text-sm text-tinta-600">
                        Este grado no tiene materias.
                      </p>
                    ) : (
                      <ul className="divide-y divide-border">
                        {degree.subjects.map((subject) => (
                          <li
                            key={subject.id}
                            className="flex items-center gap-2 py-1.5"
                          >
                            {subject.complete ? (
                              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-hoja-100">
                                <Check
                                  className="size-3.5 text-hoja-700"
                                  strokeWidth={3}
                                  aria-hidden
                                />
                              </span>
                            ) : subject.total > 0 ? (
                              <span
                                className="inline-flex size-5 shrink-0 items-center justify-center"
                                aria-hidden
                              >
                                <span className="size-2 rounded-full bg-sol-500" />
                              </span>
                            ) : (
                              <span className="size-5 shrink-0" aria-hidden />
                            )}
                            <span className="min-w-0 flex-1 text-sm leading-snug text-tinta">
                              {subject.name}
                            </span>
                            {subject.total === 0 ? (
                              <span className="shrink-0 text-xs text-tinta-600">
                                Sin estudiantes
                              </span>
                            ) : (
                              <span
                                className={cn(
                                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                                  subject.complete
                                    ? "bg-hoja-100 text-tinta"
                                    : "bg-sol-100 text-tinta"
                                )}
                              >
                                <span className="sr-only">
                                  {subject.complete ? "Completa, " : "Pendiente, "}
                                  {subject.filled} de {subject.total}
                                </span>
                                <span aria-hidden>
                                  {subject.filled}/{subject.total}
                                </span>
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="border-t border-border pt-3">
                      <Link
                        href={planillaHref(degree.id, period.id)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-azul-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {degree.pendingSubjects > 0
                          ? "Completar en planillas"
                          : "Abrir planilla"}
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SummaryStat({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail?: string;
}) {
  return (
    <Card className="gap-0 py-3 sm:py-4">
      <CardContent className="px-3 sm:px-4">
        <p className="font-display text-xl font-semibold tabular-nums text-tinta sm:text-3xl">
          {value}
        </p>
        <p className="mt-1 text-xs font-medium leading-snug text-tinta sm:text-sm">
          {label}
        </p>
        {detail ? (
          <p className="mt-1 hidden text-xs text-tinta-600 sm:block">{detail}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
