"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

interface Degree {
  id: string;
  name: string;
}

interface Period {
  id: string;
  number: number;
  year: number;
}

interface Subject {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
}

interface Grade {
  id: string;
  grade: number;
  achievements: string | null;
  studentId: string;
  student: Student;
}

interface PlanillasPageProps {
  degrees: Degree[];
  periods: Period[];
  subjects: Subject[];
  students: Student[];
  grades: Grade[];
  selectedDegreeId?: string;
  selectedPeriodId?: string;
  selectedSubjectId?: string;
}

export function PlanillasPage({
  degrees,
  periods,
  subjects,
  students,
  grades,
  selectedDegreeId,
  selectedPeriodId,
  selectedSubjectId,
}: PlanillasPageProps) {
  const router = useRouter();

  const handleDegreeChange = (value: string) => {
    const params = new URLSearchParams();
    params.set("grado", value);
    if (selectedPeriodId) {
      params.set("periodo", selectedPeriodId);
    }
    router.push(`/portal/planillas?${params.toString()}`);
  };

  const handlePeriodChange = (value: string) => {
    const params = new URLSearchParams();
    if (selectedDegreeId) {
      params.set("grado", selectedDegreeId);
    }
    params.set("periodo", value);
    router.push(`/portal/planillas?${params.toString()}`);
  };

  const handleSubjectChange = (value: string) => {
    const params = new URLSearchParams();
    if (selectedDegreeId) params.set("grado", selectedDegreeId);
    if (selectedPeriodId) params.set("periodo", selectedPeriodId);
    params.set("area", value);
    router.push(`/portal/planillas?${params.toString()}`);
  };

  const showEmptyState = !selectedDegreeId || !selectedPeriodId;
  const showTable = selectedDegreeId && selectedPeriodId && selectedSubjectId;

  // Calculate completion stats per subject
  const subjectStats = subjects.map((subject) => {
    const subjectGrades = grades.filter((g) => g.studentId);
    const completed = subjectGrades.filter((g) => g.grade !== null).length;
    const total = students.length;
    return {
      subjectId: subject.id,
      completed,
      total,
      isComplete: completed === total,
    };
  });

  return (
    <div className="flex flex-col h-full">
      {/* Context Bar */}
      <div className="bg-white border-b border-[#E3E5EE] px-4 lg:px-6 pt-4">
        <div className="flex items-end gap-4 flex-wrap">
          {/* Grado Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#596074] uppercase tracking-wide">
              Grado
            </label>
            <Select value={selectedDegreeId || ""} onValueChange={handleDegreeChange}>
              <SelectTrigger className="w-44 h-10">
                <SelectValue placeholder="Selecciona un grado" />
              </SelectTrigger>
              <SelectContent>
                {degrees.map((degree) => (
                  <SelectItem key={degree.id} value={degree.id}>
                    {degree.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Periodo Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#596074] uppercase tracking-wide">
              Periodo académico
            </label>
            <Select value={selectedPeriodId || ""} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-52 h-10">
                <SelectValue placeholder="Selecciona un periodo" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    Periodo {period.number} – {period.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desempeño Legend */}
          {!showEmptyState && (
            <div className="ml-auto flex items-center gap-4 pb-2 text-xs text-[#596074]">
              <span className="font-semibold uppercase tracking-wide">
                Desempeño:
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#15803D]"></span>
                Superior 4.6–5.0
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#1D5FD1]"></span>
                Alto 4.0–4.5
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#B45309]"></span>
                Básico 3.0–3.9
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#C81E1E]"></span>
                Bajo 1.0–2.9
              </span>
            </div>
          )}
        </div>

        {/* Area Tabs */}
        {!showEmptyState && subjects.length > 0 && (
          <Tabs
            value={selectedSubjectId || subjects[0]?.id}
            onValueChange={handleSubjectChange}
            className="mt-3 -mx-4 lg:-mx-6"
          >
            <TabsList className="h-auto bg-transparent border-b border-[#E3E5EE] rounded-none w-full justify-start px-4 lg:px-6">
              {subjects.map((subject) => {
                const stats = subjectStats.find((s) => s.subjectId === subject.id);
                const isActive = selectedSubjectId === subject.id;
                
                return (
                  <TabsTrigger
                    key={subject.id}
                    value={subject.id}
                    className={`h-10 px-3.5 -mb-px border-b-2 rounded-none data-[state=active]:border-[#5B47E0] data-[state=active]:text-[#4A36C7] data-[state=active]:font-semibold ${
                      isActive ? "" : "border-transparent text-[#596074]"
                    }`}
                  >
                    <span>{subject.name}</span>
                    {stats?.isComplete ? (
                      <span className="ml-2 text-[#146C36]">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="ml-2 text-[11px] px-1.5 py-0.5 rounded bg-[#F7F7FB] text-[#596074] tabular-nums">
                        {stats?.completed}/{stats?.total}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* Empty State */}
      {showEmptyState && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F3F1FF] flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-[#5B47E0]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M3 15h18M9 3v18" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-[#1B1F3B]">
              Elige qué planilla quieres llenar
            </h2>
            <p className="mt-2 text-sm text-[#596074]">
              Selecciona el grado y el periodo arriba. Verás a tus estudiantes en
              una tabla, con una pestaña por cada área o dimensión.
            </p>
            
            {/* Steps */}
            <div className="mt-6 space-y-3">
              <div className={`flex items-center gap-3 ${selectedDegreeId ? "text-[#15803D]" : "text-[#5B47E0]"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  selectedDegreeId ? "bg-[#E8F7EE]" : "bg-[#F3F1FF]"
                }`}>
                  {selectedDegreeId ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <span className="font-medium">Elige el grado</span>
              </div>
              <div className={`flex items-center gap-3 ${selectedPeriodId ? "text-[#15803D]" : selectedDegreeId ? "text-[#5B47E0]" : "text-[#596074]"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  selectedPeriodId ? "bg-[#E8F7EE]" : selectedDegreeId ? "bg-[#F3F1FF]" : "bg-[#F7F7FB]"
                }`}>
                  {selectedPeriodId ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <span className="font-medium">Elige el periodo</span>
              </div>
              <div className="flex items-center gap-3 text-[#596074]">
                <div className="w-8 h-8 rounded-full bg-[#F7F7FB] flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <span className="font-medium">Registra las notas</span>
              </div>
            </div>

            <p className="mt-6 text-xs text-[#596074]">
              Escribe y avanza con Enter o Tab. Se guarda solo.
            </p>
          </div>
        </div>
      )}

      {/* Table Area - TODO: Implement spreadsheet grid */}
      {showTable && students.length > 0 && (
        <div className="flex-1 overflow-auto px-4 lg:px-6 py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-[#596074]">
              <b className="text-[#1F2433]">
                {subjects.find((s) => s.id === selectedSubjectId)?.name}
              </b>{" "}
              · {grades.filter((g) => g.grade !== null).length} de {students.length} notas
            </p>
          </div>
          
          {/* Placeholder for the actual spreadsheet grid */}
          <div className="rounded-xl border border-[#E3E5EE] bg-white p-8 text-center text-[#596074]">
            <p>Spreadsheet grid will be implemented here</p>
            <p className="text-sm mt-2">
              {students.length} estudiantes · {grades.length} grades loaded
            </p>
          </div>
        </div>
      )}

      {/* No students state */}
      {showTable && students.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-[#596074]">
            Este grado todavía no tiene estudiantes inscritos.
          </p>
        </div>
      )}
    </div>
  );
}
