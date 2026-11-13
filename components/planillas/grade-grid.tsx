"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { GradeCell } from "./grade-cell";
import { TextCell } from "./text-cell";
import { DesempenoCell } from "./desempeno-cell";
import { EstadoCell } from "./estado-cell";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

interface Student {
  id: string;
  name: string;
}

interface GradeData {
  studentId: string;
  grade: number | null;
  achievements: string | null;
}

interface GradeGridProps {
  students: Student[];
  subjectId: string; // eslint-disable-line @typescript-eslint/no-unused-vars
  subjectName: string;
  periodId: string; // eslint-disable-line @typescript-eslint/no-unused-vars
  initialGrades: GradeData[];
}

interface CellState {
  value: string;
  status: "idle" | "editing" | "saving" | "saved" | "error" | "invalid";
  error?: string;
  savedValue?: string;
}

interface CellPosition {
  row: number;
  col: number;
}

const COLUMNS = ["nota", "logros", "observacion"] as const;
type ColumnType = typeof COLUMNS[number];

export function GradeGrid({
  students,
  subjectName,
  initialGrades,
}: GradeGridProps) {
  // Initialize cell states
  const [cellStates, setCellStates] = useState<Record<string, CellState>>(() => {
    const states: Record<string, CellState> = {};
    students.forEach((student) => {
      const grade = initialGrades.find((g) => g.studentId === student.id);
      states[`${student.id}-nota`] = {
        value: grade?.grade?.toString() || "",
        status: "idle",
        savedValue: grade?.grade?.toString() || "",
      };
      states[`${student.id}-logros`] = {
        value: grade?.achievements || "",
        status: "idle",
        savedValue: grade?.achievements || "",
      };
      states[`${student.id}-observacion`] = {
        value: "",
        status: "idle",
        savedValue: "",
      };
    });
    return states;
  });

  const [activeCell, setActiveCell] = useState<CellPosition | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const getCellKey = (studentId: string, col: ColumnType) => `${studentId}-${col}`;

  const getStudentIdFromKey = (key: string) => key.split("-")[0];
  const getColumnFromKey = (key: string) => key.split("-")[1] as ColumnType;

  const hasUnsavedChanges = useCallback(() => {
    return Object.entries(cellStates).some(([, state]) => {
      return (
        state.status === "editing" ||
        state.status === "saving" ||
        state.status === "error" ||
        state.status === "invalid"
      );
    });
  }, [cellStates]);
  
  // Prevent navigation with unsaved changes
  console.log("Has unsaved changes:", hasUnsavedChanges());

  const validateGrade = (value: string): { valid: boolean; error?: string } => {
    if (!value.trim()) {
      return { valid: true }; // Empty is valid (null)
    }

    // Accept comma or dot as decimal separator
    const normalized = value.trim().replace(",", ".");
    const gradeRegex = /^([1-4](\.\d)?|5(\.0)?)$/;

    if (!gradeRegex.test(normalized)) {
      return {
        valid: false,
        error: "Nota no válida. Escribe un número entre 1.0 y 5.0 (ej. 4.5 o 4,5).",
      };
    }

    const numValue = parseFloat(normalized);
    if (numValue < 1.0 || numValue > 5.0) {
      return {
        valid: false,
        error: "Nota no válida. Escribe un número entre 1.0 y 5.0 (ej. 4.5 o 4,5).",
      };
    }

    // Check for more than one decimal place
    const decimalPart = normalized.split(".")[1];
    if (decimalPart && decimalPart.length > 1) {
      return {
        valid: false,
        error: "Usa solo un decimal (ej. 4.5).",
      };
    }

    return { valid: true };
  };

  const saveCell = useCallback(
    async (studentId: string, column: ColumnType, value: string) => {
      const key = getCellKey(studentId, column);

      // Validate grade
      if (column === "nota") {
        const validation = validateGrade(value);
        if (!validation.valid) {
          setCellStates((prev) => ({
            ...prev,
            [key]: {
              ...prev[key],
              status: "invalid",
              error: validation.error,
            },
          }));
          return;
        }
      }

      setCellStates((prev) => ({
        ...prev,
        [key]: { ...prev[key], status: "saving" },
      }));

      // Simulate API call with retry logic
      const saveWithRetry = async (attempt = 1): Promise<boolean> => {
        try {
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              // Simulate 10% failure rate for testing
              if (Math.random() < 0.1 && attempt === 1) {
                reject(new Error("Network error"));
              } else {
                resolve(true);
              }
            }, 500);
          });

          // Success
          setCellStates((prev) => ({
            ...prev,
            [key]: {
              ...prev[key],
              status: "saved",
              savedValue: value,
            },
          }));

          // Reset to idle after 3 seconds
          setTimeout(() => {
            setCellStates((prev) => ({
              ...prev,
              [key]: { ...prev[key], status: "idle" },
            }));
          }, 3000);

          return true;
        } catch {
          if (attempt < 3) {
            // Retry with exponential backoff
            const delay = [1000, 3000, 8000][attempt - 1];
            await new Promise((resolve) => setTimeout(resolve, delay));
            return saveWithRetry(attempt + 1);
          } else {
            // Failed after 3 attempts
            setCellStates((prev) => ({
              ...prev,
              [key]: {
                ...prev[key],
                status: "error",
                error: "Error al guardar",
              },
            }));
            return false;
          }
        }
      };

      await saveWithRetry();
    },
    []
  );

  const handleCellChange = (studentId: string, column: ColumnType, value: string) => {
    const key = getCellKey(studentId, column);
    setCellStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], value, status: "editing" },
    }));

    // Clear existing timeout
    if (saveTimeoutRef.current[key]) {
      clearTimeout(saveTimeoutRef.current[key]);
    }

    // For text fields, debounce save
    if (column !== "nota") {
      saveTimeoutRef.current[key] = setTimeout(() => {
        saveCell(studentId, column, value);
      }, 800);
    }
  };

  const handleCellCommit = (studentId: string, column: ColumnType) => {
    const key = getCellKey(studentId, column);
    const state = cellStates[key];

    if (state.value !== state.savedValue) {
      // Clear any pending timeout
      if (saveTimeoutRef.current[key]) {
        clearTimeout(saveTimeoutRef.current[key]);
      }
      saveCell(studentId, column, state.value);
    }
  };

  const moveFocus = (direction: "up" | "down" | "left" | "right") => {
    if (!activeCell) return;

    let { row, col } = activeCell;

    switch (direction) {
      case "up":
        row = Math.max(0, row - 1);
        break;
      case "down":
        row = Math.min(students.length - 1, row + 1);
        break;
      case "left":
        col = Math.max(0, col - 1);
        break;
      case "right":
        col = Math.min(COLUMNS.length - 1, col + 1);
        // If at end of row, move to next row
        if (col === COLUMNS.length - 1 && activeCell.col === COLUMNS.length - 1) {
          col = 0;
          row = Math.min(students.length - 1, row + 1);
        }
        break;
    }

    setActiveCell({ row, col });
  };

  const handleNavigation = (e: React.KeyboardEvent, studentId: string, column: ColumnType) => {
    const currentRow = students.findIndex((s) => s.id === studentId);

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCellCommit(studentId, column);
      
      if (currentRow === students.length - 1) {
        // Last row - show toast
        // For now, just stay
      } else {
        moveFocus("down");
      }
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleCellCommit(studentId, column);
      moveFocus("up");
    } else if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      handleCellCommit(studentId, column);
      moveFocus("right");
    } else if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      handleCellCommit(studentId, column);
      moveFocus("left");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      handleCellCommit(studentId, column);
      moveFocus("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleCellCommit(studentId, column);
      moveFocus("down");
    } else if (e.key === "Escape") {
      e.preventDefault();
      // Revert to saved value
      const key = getCellKey(studentId, column);
      setCellStates((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: prev[key].savedValue || "",
          status: "idle",
        },
      }));
    }
  };

  // Global save shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        // Flush all pending saves
        Object.entries(cellStates).forEach(([key, state]) => {
          if (state.status === "editing") {
            const studentId = getStudentIdFromKey(key);
            const column = getColumnFromKey(key);
            saveCell(studentId, column, state.value);
          }
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cellStates, saveCell]);

  return (
    <>
      <div ref={gridRef} className="rounded-xl border border-[#E3E5EE] bg-white shadow-[0_1px_2px_rgba(27,31,59,.06),0_4px_16px_rgba(27,31,59,.06)] overflow-hidden">
        <table
          className="w-full border-separate border-spacing-0"
          role="grid"
          aria-label={`Planilla de ${subjectName}`}
        >
          <thead className="sticky top-0 z-20">
            <tr className="bg-[#F7F7FB] text-left text-xs font-semibold text-[#596074] uppercase tracking-wide">
              <th className="sticky left-0 z-30 bg-[#F7F7FB] px-3 h-11 border-b border-[#E3E5EE] w-10">
                #
              </th>
              <th className="sticky left-10 z-30 bg-[#F7F7FB] px-3 h-11 border-b border-r border-[#E3E5EE]">
                Estudiante
              </th>
              <th className="px-3 h-11 border-b border-[#E3E5EE] bg-[#E7E3FF] text-[#3B2BA0]">
                <span className="whitespace-nowrap">
                  Nota <span className="normal-case font-normal">1.0–5.0</span>
                </span>
              </th>
              <th className="px-3 h-11 border-b border-[#E3E5EE]">Desempeño</th>
              <th className="px-3 h-11 border-b border-[#E3E5EE] w-[38%]">Logros</th>
              <th className="px-3 h-11 border-b border-[#E3E5EE] w-[26%]">
                Observación general
              </th>
              <th className="px-3 h-11 border-b border-[#E3E5EE] w-[112px]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const isActiveRow = activeCell?.row === index;
              const notaKey = getCellKey(student.id, "nota");
              const logrosKey = getCellKey(student.id, "logros");
              const observacionKey = getCellKey(student.id, "observacion");

              return (
                <tr
                  key={student.id}
                  className={`border-b border-[#E3E5EE] ${
                    isActiveRow ? "bg-[#F3F1FF]/70" : "bg-white"
                  }`}
                  data-active-row={isActiveRow || undefined}
                >
                  <td className={`sticky left-0 z-10 px-3 py-2 w-10 text-xs text-[#596074] tabular-nums relative ${
                    isActiveRow ? "bg-[#F3F1FF]/70" : "bg-white"
                  }`}>
                    {isActiveRow && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#5B47E0]"></span>
                    )}
                    {index + 1}
                  </td>
                  <th
                    scope="row"
                    className={`sticky left-10 z-10 px-3 py-2 text-left text-sm ${
                      isActiveRow ? "font-semibold text-[#3B2BA0] bg-[#F3F1FF]/70" : "font-medium text-[#1F2433] bg-white"
                    } whitespace-nowrap border-r border-[#E3E5EE] shadow-[4px_0_6px_-4px_rgba(27,31,59,.12)]`}
                  >
                    {student.name}
                  </th>
                  <td className={`px-3 py-2 ${activeCell?.row === index && activeCell?.col === 0 ? "bg-[#E7E3FF]/80" : "bg-[#F3F1FF]/70"}`}>
                    <GradeCell
                      studentId={student.id}
                      studentName={student.name}
                      value={cellStates[notaKey].value}
                      status={cellStates[notaKey].status}
                      error={cellStates[notaKey].error}
                      isActive={activeCell?.row === index && activeCell?.col === 0}
                      onChange={(value) => handleCellChange(student.id, "nota", value)}
                      onCommit={() => handleCellCommit(student.id, "nota")}
                      onKeyDown={(e) => handleNavigation(e, student.id, "nota")}
                      onFocus={() => setActiveCell({ row: index, col: 0 })}
                    />
                  </td>
                  <td className="px-3 py-2 w-[104px]">
                    <DesempenoCell value={cellStates[notaKey].value} />
                  </td>
                  <td className="px-3 py-2">
                    <TextCell
                      studentName={student.name}
                      field="logros"
                      value={cellStates[logrosKey].value}
                      placeholder="Agregar logros…"
                      isActive={activeCell?.row === index && activeCell?.col === 1}
                      onChange={(value) => handleCellChange(student.id, "logros", value)}
                      onCommit={() => handleCellCommit(student.id, "logros")}
                      onKeyDown={(e) => handleNavigation(e, student.id, "logros")}
                      onFocus={() => setActiveCell({ row: index, col: 1 })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <TextCell
                      studentName={student.name}
                      field="observacion"
                      value={cellStates[observacionKey].value}
                      placeholder="Agregar observación…"
                      isActive={activeCell?.row === index && activeCell?.col === 2}
                      onChange={(value) => handleCellChange(student.id, "observacion", value)}
                      onCommit={() => handleCellCommit(student.id, "observacion")}
                      onKeyDown={(e) => handleNavigation(e, student.id, "observacion")}
                      onFocus={() => setActiveCell({ row: index, col: 2 })}
                    />
                  </td>
                  <td className="px-3 py-2 w-[112px]">
                    <EstadoCell
                      notaStatus={cellStates[notaKey].status}
                      logrosStatus={cellStates[logrosKey].status}
                      observacionStatus={cellStates[observacionKey].status}
                      onRetry={() => {
                        if (cellStates[notaKey].status === "error") {
                          saveCell(student.id, "nota", cellStates[notaKey].value);
                        }
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        affectedStudents={[]}
        onConfirm={() => {
          setShowUnsavedDialog(false);
          if (pendingNavigation) {
            window.location.href = pendingNavigation;
          }
        }}
        onCancel={() => {
          setShowUnsavedDialog(false);
          setPendingNavigation(null);
        }}
      />
    </>
  );
}
