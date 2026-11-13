"use client";

import Link from "next/link";
import { Table2, Award, Users, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DegreeProgress {
  degreeId: string;
  degreeName: string;
  totalStudents: number;
  completedGrades: number;
  totalNotes: number;
  percentage: number;
  subjectsProgress: {
    subjectId: string;
    subjectName: string;
    completed: number;
    total: number;
    percentage: number;
  }[];
}

interface PortalHomeProps {
  user: {
    name?: string | null;
    role?: string;
  };
  currentPeriod: {
    id: string;
    number: number;
    year: number;
  } | null;
  degreesProgress: DegreeProgress[];
  totalMissingNotes: number;
}

export function PortalHome({
  user,
  currentPeriod,
  degreesProgress,
  totalMissingNotes,
}: PortalHomeProps) {
  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  
  const periodLabel = currentPeriod
    ? `Periodo ${currentPeriod.number} · ${currentPeriod.year}`
    : "ningún periodo";
  
  const firstName = user.name?.split(" ")[0] || "Usuario";
  
  // Mock close date - in production this would come from Period model
  const closeDate = "viernes 27 de noviembre";

  return (
    <div className="p-4 lg:p-8 max-w-[1120px]">
      {/* Greeting */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-[#C42A82] capitalize">
            {today}
          </p>
          <h1 className="mt-1 text-[30px] lg:text-[30px] text-[24px] font-bold text-[#1B1F3B] tracking-tight">
            ¡Hola, {firstName}! 👋
          </h1>
          <p className="mt-1 text-[#596074]">
            {totalMissingNotes > 0 ? (
              <>
                Te faltan <span className="font-semibold text-[#1F2433]">{totalMissingNotes} notas</span>{" "}
                para cerrar el {periodLabel}. El cierre es el{" "}
                <span className="font-semibold text-[#1F2433]">{closeDate}</span>.
              </>
            ) : (
              <>
                ¡Todo listo! Completaste las notas del {periodLabel}.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <section aria-label="Acciones rápidas" className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Link
          href="/portal/planillas"
          className="group bg-white rounded-2xl border border-[#E3E5EE] shadow-[0_1px_2px_rgba(27,31,59,.06),0_4px_16px_rgba(27,31,59,.06)] p-5 flex gap-4 items-start hover:border-[#ADA0FB] transition-colors"
        >
          <span className="w-11 h-11 rounded-xl bg-[#F3F1FF] text-[#4A36C7] flex items-center justify-center shrink-0">
            <Table2 className="w-5 h-5" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold text-[#1B1F3B]">
              Registrar calificaciones
            </span>
            <span className="block text-sm text-[#596074] mt-0.5">
              Retoma Primero · Ciencias Sociales
            </span>
          </span>
          <ChevronRight className="w-5 h-5 text-[#5B47E0] mt-3" />
        </Link>

        <Link
          href="/portal/boletines"
          className="bg-white rounded-2xl border border-[#E3E5EE] shadow-[0_1px_2px_rgba(27,31,59,.06),0_4px_16px_rgba(27,31,59,.06)] p-5 flex gap-4 items-start hover:border-[#ADA0FB] transition-colors"
        >
          <span className="w-11 h-11 rounded-xl bg-[#FDEEF6] text-[#C42A82] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold text-[#1B1F3B]">
              Generar boletines
            </span>
            <span className="block text-sm text-[#596074] mt-0.5">
              Disponibles cuando el grado esté completo
            </span>
          </span>
          <ChevronRight className="w-5 h-5 text-[#5B47E0] mt-3" />
        </Link>

        <Link
          href="/portal/grados"
          className="bg-white rounded-2xl border border-[#E3E5EE] shadow-[0_1px_2px_rgba(27,31,59,.06),0_4px_16px_rgba(27,31,59,.06)] p-5 flex gap-4 items-start hover:border-[#ADA0FB] transition-colors"
        >
          <span className="w-11 h-11 rounded-xl bg-[#FFF7E0] text-[#9A5B00] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold text-[#1B1F3B]">
              Mis grados
            </span>
            <span className="block text-sm text-[#596074] mt-0.5">
              {degreesProgress.map(d => d.degreeName).join(" y ")} ·{" "}
              {degreesProgress.reduce((sum, d) => sum + d.totalStudents, 0)} estudiantes
            </span>
          </span>
          <ChevronRight className="w-5 h-5 text-[#5B47E0] mt-3" />
        </Link>
      </section>

      {/* Progress Section */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1B1F3B]">
          Avance de notas · {periodLabel}
        </h2>
        <span className="text-sm text-[#596074]">
          Solo ves los grados que tienes asignados
        </span>
      </div>

      {degreesProgress.length === 0 ? (
        <div className="mt-3 bg-white rounded-2xl border border-[#E3E5EE] shadow-[0_1px_2px_rgba(27,31,59,.06),0_4px_16px_rgba(27,31,59,.06)] p-8 text-center">
          <p className="text-[#596074]">
            Aún no tienes grados asignados. Pídele a coordinación que te asigne uno.
          </p>
        </div>
      ) : (
        <section className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {degreesProgress.map((degree, index) => (
            <article
              key={degree.degreeId}
              className="bg-white rounded-2xl border border-[#E3E5EE] shadow-[0_1px_2px_rgba(27,31,59,.06),0_4px_16px_rgba(27,31,59,.06)] p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    index === 0 ? "bg-[#F3F1FF] text-[#4A36C7]" : "bg-[#FDEEF6] text-[#C42A82]"
                  }`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10 12 5 2 10l10 5 10-5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B1F3B]">
                      {degree.degreeName}
                    </h3>
                    <p className="text-sm text-[#596074]">
                      {degree.totalStudents} estudiantes · Directora de grupo
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#1B1F3B] tabular-nums">
                    {Math.round(degree.percentage)}%
                  </div>
                  <div className="text-xs text-[#596074]">notas del periodo</div>
                </div>
              </div>

              {/* Subject Progress */}
              <ul className="mt-3 divide-y divide-[#E3E5EE]/70">
                {degree.subjectsProgress.map((subject) => {
                  const isComplete = subject.completed === subject.total;
                  const missing = subject.total - subject.completed;
                  
                  return (
                    <li key={subject.subjectId} className="flex items-center gap-3 py-2">
                      <span className="w-40 text-sm text-[#1F2433]">
                        {subject.subjectName}
                      </span>
                      <span className="flex-1 h-1.5 rounded-full bg-[#F7F7FB] overflow-hidden">
                        <span
                          className={`block h-full rounded-full ${
                            isComplete ? "bg-[#15803D]" : "bg-[#5B47E0]"
                          }`}
                          style={{ width: `${subject.percentage}%` }}
                        />
                      </span>
                      <span className="w-12 text-right text-xs text-[#596074] tabular-nums">
                        {subject.completed}/{subject.total}
                      </span>
                      <span className="w-24 text-right">
                        {isComplete ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#146C36]">
                            <Check className="w-3.5 h-3.5" />
                            Completa
                          </span>
                        ) : subject.completed === 0 ? (
                          <span className="text-xs font-medium text-[#596074]">
                            Sin iniciar
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-[#B45309] tabular-nums">
                            Faltan {missing}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Button
                  asChild
                  className="h-9 px-4 rounded-full bg-[#5B47E0] text-white text-sm font-semibold hover:bg-[#4A36C7]"
                >
                  <Link href={`/portal/planillas?grado=${degree.degreeId}`}>
                    Continuar planilla
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-9 px-4 rounded-full border-[#E3E5EE] text-sm font-medium text-[#1F2433] hover:bg-[#F7F7FB]"
                >
                  <Link href={`/portal/boletines?grado=${degree.degreeId}`}>
                    <Award className="w-4 h-4 mr-2" />
                    Ver boletines
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
