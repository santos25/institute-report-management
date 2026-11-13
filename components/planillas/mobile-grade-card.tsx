"use client";

import { useState } from "react";
import { GradeCell } from "./grade-cell";
import { DesempenoCell } from "./desempeno-cell";
import { EstadoCell } from "./estado-cell";
import { Maximize2 } from "lucide-react";

interface Student {
  id: string;
  name: string;
}

interface CellState {
  value: string;
  status: "idle" | "editing" | "saving" | "saved" | "error" | "invalid";
  error?: string;
}

interface MobileGradeCardProps {
  student: Student;
  subjectName: string;
  notaState: CellState;
  logrosState: CellState;
  observacionState: CellState;
  onGradeChange: (value: string) => void;
  onGradeCommit: () => void;
  onLogrosChange: (value: string) => void;
  onLogrosCommit: () => void;
  onObservacionChange: (value: string) => void;
  onObservacionCommit: () => void;
  onRetry: () => void;
}

export function MobileGradeCard({
  student,
  subjectName,
  notaState,
  logrosState,
  observacionState,
  onGradeChange,
  onGradeCommit,
  onLogrosChange,
  onLogrosCommit,
  onObservacionChange,
  onObservacionCommit,
  onRetry,
}: MobileGradeCardProps) {
  const [expandedField, setExpandedField] = useState<
    "logros" | "observacion" | null
  >(null);

  return (
    <div className="rounded-2xl border border-[#E3E5EE] bg-white p-4 shadow-sm">
      {/* Student header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-base font-bold text-[#1B1F3B]">{student.name}</h3>
          <p className="text-xs text-[#596074] mt-0.5">{subjectName}</p>
        </div>
        <EstadoCell
          notaStatus={notaState.status}
          logrosStatus={logrosState.status}
          observacionStatus={observacionState.status}
          onRetry={onRetry}
        />
      </div>

      {/* Grade and Desempeño */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold text-[#596074]">
            Nota
          </label>
          <GradeCell
            studentId={student.id}
            studentName={student.name}
            value={notaState.value}
            status={notaState.status}
            error={notaState.error}
            isActive={false}
            onChange={onGradeChange}
            onCommit={onGradeCommit}
            onKeyDown={() => {}}
            onFocus={() => {}}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold text-[#596074]">
            Desempeño
          </label>
          <div className="flex h-11 items-center">
            <DesempenoCell value={notaState.value} />
          </div>
        </div>
      </div>

      {/* Logros */}
      <div className="mb-3">
        <label
          htmlFor={`logros-${student.id}`}
          className="mb-1.5 block text-xs font-semibold text-[#596074]"
        >
          Logros
        </label>
        {expandedField === "logros" ? (
          <textarea
            id={`logros-${student.id}`}
            value={logrosState.value}
            onChange={(e) => onLogrosChange(e.target.value)}
            onBlur={() => {
              setExpandedField(null);
              onLogrosCommit();
            }}
            placeholder="Agregar logros alcanzados por el estudiante…"
            rows={4}
            autoFocus
            className="w-full rounded-lg border border-[#5B47E0] bg-white px-3 py-2.5 text-sm text-[#1F2433] outline-none ring-4 ring-[#5B47E0]/25 placeholder:text-[#596074]/70 placeholder:italic"
          />
        ) : (
          <div
            className="flex h-11 cursor-text items-center gap-2 rounded-lg border border-[#E3E5EE] bg-white px-2.5 text-sm"
            onClick={() => setExpandedField("logros")}
          >
            <span
              className={
                logrosState.value.trim()
                  ? "flex-1 truncate text-[#1F2433]"
                  : "flex-1 italic text-[#596074]/70"
              }
            >
              {logrosState.value.trim() || "Agregar logros…"}
            </span>
            <button
              aria-label="Ampliar logros"
              className="shrink-0 text-[#596074]"
              tabIndex={-1}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Observación */}
      <div>
        <label
          htmlFor={`observacion-${student.id}`}
          className="mb-1.5 block text-xs font-semibold text-[#596074]"
        >
          Observación general
        </label>
        {expandedField === "observacion" ? (
          <textarea
            id={`observacion-${student.id}`}
            value={observacionState.value}
            onChange={(e) => onObservacionChange(e.target.value)}
            onBlur={() => {
              setExpandedField(null);
              onObservacionCommit();
            }}
            placeholder="Agregar observación general sobre el estudiante…"
            rows={4}
            autoFocus
            className="w-full rounded-lg border border-[#5B47E0] bg-white px-3 py-2.5 text-sm text-[#1F2433] outline-none ring-4 ring-[#5B47E0]/25 placeholder:text-[#596074]/70 placeholder:italic"
          />
        ) : (
          <div
            className="flex h-11 cursor-text items-center gap-2 rounded-lg border border-[#E3E5EE] bg-white px-2.5 text-sm"
            onClick={() => setExpandedField("observacion")}
          >
            <span
              className={
                observacionState.value.trim()
                  ? "flex-1 truncate text-[#1F2433]"
                  : "flex-1 italic text-[#596074]/70"
              }
            >
              {observacionState.value.trim() || "Agregar observación…"}
            </span>
            <button
              aria-label="Ampliar observación"
              className="shrink-0 text-[#596074]"
              tabIndex={-1}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
