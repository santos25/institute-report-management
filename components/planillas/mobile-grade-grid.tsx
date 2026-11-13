"use client";

import { useState, useCallback, useEffect } from "react";
import { MobileGradeCard } from "./mobile-grade-card";

interface Student {
  id: string;
  name: string;
}

interface GradeData {
  studentId: string;
  grade: number | null;
  achievements: string | null;
}

interface MobileGradeGridProps {
  students: Student[];
  subjectName: string;
  initialGrades: GradeData[];
}

interface CellState {
  value: string;
  status: "idle" | "editing" | "saving" | "saved" | "error" | "invalid";
  error?: string;
  retryCount: number;
}

export function MobileGradeGrid({
  students,
  subjectName,
  initialGrades,
}: MobileGradeGridProps) {
  const [cellStates, setCellStates] = useState<Record<string, CellState>>(() => {
    const states: Record<string, CellState> = {};
    
    students.forEach((student) => {
      const gradeData = initialGrades.find((g) => g.studentId === student.id);
      
      states[`${student.id}-nota`] = {
        value: gradeData?.grade?.toFixed(1) || "",
        status: "idle",
        retryCount: 0,
      };
      
      states[`${student.id}-logros`] = {
        value: gradeData?.achievements || "",
        status: "idle",
        retryCount: 0,
      };
      
      states[`${student.id}-observacion`] = {
        value: "",
        status: "idle",
        retryCount: 0,
      };
    });
    
    return states;
  });

  const handleCellChange = useCallback(
    (studentId: string, column: "nota" | "logros" | "observacion", value: string) => {
      const key = `${studentId}-${column}`;
      setCellStates((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          value,
          status: "editing",
        },
      }));
    },
    []
  );

  const saveCell = useCallback(
    async (
      studentId: string,
      column: "nota" | "logros" | "observacion",
      value: string,
      attempt: number = 0
    ): Promise<boolean> => {
      const key = `${studentId}-${column}`;

      setCellStates((prev) => ({
        ...prev,
        [key]: { ...prev[key], status: "saving" },
      }));

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Random success/failure for demo
        if (Math.random() > 0.1) {
          setCellStates((prev) => ({
            ...prev,
            [key]: { ...prev[key], status: "saved", error: undefined },
          }));

          setTimeout(() => {
            setCellStates((prev) => ({
              ...prev,
              [key]: { ...prev[key], status: "idle" },
            }));
          }, 3000);

          return true;
        } else {
          throw new Error("Network error");
        }
      } catch {
        if (attempt < 3) {
          const delays = [1000, 3000, 8000];
          await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
          return saveCell(studentId, column, value, attempt + 1);
        } else {
          setCellStates((prev) => ({
            ...prev,
            [key]: {
              ...prev[key],
              status: "error",
              error: "No se pudo guardar. Verifica tu conexión.",
              retryCount: attempt,
            },
          }));
          return false;
        }
      }
    },
    []
  );

  const handleCellCommit = useCallback(
    (studentId: string, column: "nota" | "logros" | "observacion") => {
      const key = `${studentId}-${column}`;
      const state = cellStates[key];

      if (column === "nota" && state.value.trim()) {
        const normalized = state.value.trim().replace(",", ".");
        const grade = parseFloat(normalized);

        if (isNaN(grade) || grade < 1.0 || grade > 5.0) {
          setCellStates((prev) => ({
            ...prev,
            [key]: {
              ...prev[key],
              status: "invalid",
              error: "Ingresa un número entre 1.0 y 5.0",
            },
          }));
          return;
        }

        const rounded = Math.round(grade * 10) / 10;
        setCellStates((prev) => ({
          ...prev,
          [key]: { ...prev[key], value: rounded.toFixed(1) },
        }));
      }

      if (state.value.trim()) {
        saveCell(studentId, column, state.value);
      } else {
        setCellStates((prev) => ({
          ...prev,
          [key]: { ...prev[key], status: "idle" },
        }));
      }
    },
    [cellStates, saveCell]
  );

  const handleRetry = useCallback(
    (studentId: string) => {
      const notaKey = `${studentId}-nota`;
      const logrosKey = `${studentId}-logros`;
      const observacionKey = `${studentId}-observacion`;

      if (cellStates[notaKey].status === "error") {
        saveCell(studentId, "nota", cellStates[notaKey].value);
      }
      if (cellStates[logrosKey].status === "error") {
        saveCell(studentId, "logros", cellStates[logrosKey].value);
      }
      if (cellStates[observacionKey].status === "error") {
        saveCell(studentId, "observacion", cellStates[observacionKey].value);
      }
    },
    [cellStates, saveCell]
  );

  return (
    <div className="space-y-3 px-4 py-4">
      {students.map((student) => {
        const notaKey = `${student.id}-nota`;
        const logrosKey = `${student.id}-logros`;
        const observacionKey = `${student.id}-observacion`;

        return (
          <MobileGradeCard
            key={student.id}
            student={student}
            subjectName={subjectName}
            notaState={cellStates[notaKey]}
            logrosState={cellStates[logrosKey]}
            observacionState={cellStates[observacionKey]}
            onGradeChange={(value) => handleCellChange(student.id, "nota", value)}
            onGradeCommit={() => handleCellCommit(student.id, "nota")}
            onLogrosChange={(value) => handleCellChange(student.id, "logros", value)}
            onLogrosCommit={() => handleCellCommit(student.id, "logros")}
            onObservacionChange={(value) =>
              handleCellChange(student.id, "observacion", value)
            }
            onObservacionCommit={() => handleCellCommit(student.id, "observacion")}
            onRetry={() => handleRetry(student.id)}
          />
        );
      })}
    </div>
  );
}
