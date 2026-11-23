"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student } from "@prisma/client";
import { Subject } from "@prisma/client";
import { getGradesAndObservationsBySubjectPeriod } from "@/lib/actions/grade.actions";
import { getGradeCountsByDegreePeriod } from "@/lib/actions/grade.actions";
import { saveGrades } from "@/lib/actions/grade.actions";
import { PREESCOLAR_LEVEL } from "@/lib/constant";
import { calculateDS } from "@/lib/utils";
import SaveGradesBar from "@/components/shared/planilla/SaveGradesBar";
import SubjectChips from "@/components/shared/planilla/SubjectChips";
import {
  cloneSnapshot,
  countFieldChanges,
  countStudentsWithGrade,
  EMPTY_GRADE_SNAPSHOT,
  formatSubjectProgress,
  isSubjectComplete,
  resolveSaveBarState,
  type GradeSnapshot,
} from "@/components/shared/planilla/grade-entry-utils";

interface GradeEntryFormProps {
  ref?: Ref<GradeEntryFormHandle>;
  degree: { id: string; name: string };
  period: { id: string; number: string; year?: number };
  subjects: Subject[];
  students: Student[];
  onRequestSubjectChange: (subjectId: string) => void;
}

export type GradeEntryFormHandle = {
  save: () => Promise<boolean>;
  revert: () => void;
  changeSubject: (subjectId: string) => void;
  hasUnsavedChanges: () => boolean;
  isSaving: () => boolean;
};

const SAVE_TOAST = {
  style: { marginBottom: "7.5rem" },
};

export default function GradeEntryForm({
  ref,
  degree,
  period,
  subjects,
  students,
  onRequestSubjectChange,
}: GradeEntryFormProps) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [achievements, setAchievements] = useState<Record<string, string>>({});
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [baseline, setBaseline] = useState<GradeSnapshot>(EMPTY_GRADE_SNAPSHOT);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [progress, setProgress] = useState<{
    status: "loading" | "ready" | "error";
    counts: Record<string, number>;
  }>({ status: "loading", counts: {} });

  const requestSeq = useRef(0);
  const saveInFlight = useRef<Promise<boolean> | null>(null);
  const selectedSubjectRef = useRef(selectedSubject);
  const savingRef = useRef(saving);
  const degreeStudentIdsRef = useRef<string[]>([]);

  const degreeStudentIds = useMemo(
    () =>
      students
        .filter((student) => student.degreeId === degree.id)
        .map((student) => student.id),
    [students, degree.id]
  );

  degreeStudentIdsRef.current = degreeStudentIds;
  selectedSubjectRef.current = selectedSubject;
  savingRef.current = saving;

  const changeCount = useMemo(
    () =>
      countFieldChanges(
        { grades, achievements, observations },
        baseline,
        degreeStudentIds
      ),
    [grades, achievements, observations, baseline, degreeStudentIds]
  );

  const changeCountRef = useRef(changeCount);
  changeCountRef.current = changeCount;

  const applySnapshot = useCallback((snapshot: GradeSnapshot) => {
    const next = cloneSnapshot(snapshot);
    setGrades(next.grades);
    setAchievements(next.achievements);
    setObservations(next.observations);
    setBaseline(cloneSnapshot(snapshot));
  }, []);

  const rememberSubjectCount = useCallback(
    (subjectId: string, snapshotGrades: Record<string, string>) => {
      const filled = countStudentsWithGrade(
        snapshotGrades,
        degreeStudentIdsRef.current
      );
      setProgress((current) => ({
        ...current,
        counts: { ...current.counts, [subjectId]: filled },
      }));
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    getGradeCountsByDegreePeriod(degree.id, period.id).then((result) => {
      if (cancelled) return;
      if (!result.success) {
        setProgress((current) => ({
          status: "error",
          counts: current.counts,
        }));
        return;
      }
      setProgress((current) => ({
        status: "ready",
        counts: { ...result.counts, ...current.counts },
      }));
    });

    return () => {
      cancelled = true;
    };
  }, [degree.id, period.id]);

  useEffect(() => {
    if (changeCount === 0) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [changeCount]);

  const loadSubject = useCallback(
    async (subjectId: string) => {
      if (!subjectId || subjectId === selectedSubjectRef.current) return;
      if (savingRef.current) return;

      const seq = ++requestSeq.current;
      selectedSubjectRef.current = subjectId;
      setSelectedSubject(subjectId);
      setLoading(true);
      setSavedAt(null);
      setSaveError(false);

      try {
        const result = await getGradesAndObservationsBySubjectPeriod(
          subjectId,
          period.id,
          degree.id
        );

        if (seq !== requestSeq.current) return;

        if (!result.success || !result.data) {
          console.error(
            "Failed to fetch grades:",
            "error" in result ? result.error : undefined
          );
          applySnapshot(EMPTY_GRADE_SNAPSHOT);
          return;
        }

        const next: GradeSnapshot = {
          grades: {},
          achievements: {},
          observations: {},
        };

        Object.entries(result.data).forEach(([studentId, data]) => {
          next.grades[studentId] = data.grade ? data.grade.toString() : "";
          next.achievements[studentId] = data.achievements;
          next.observations[studentId] = data.observation;
        });

        applySnapshot(next);
        rememberSubjectCount(subjectId, next.grades);
      } catch (error) {
        if (seq !== requestSeq.current) return;
        console.error("Error fetching grades:", error);
        applySnapshot(EMPTY_GRADE_SNAPSHOT);
      } finally {
        if (seq === requestSeq.current) setLoading(false);
      }
    },
    [applySnapshot, degree.id, period.id, rememberSubjectCount]
  );

  const handleRevert = useCallback(() => {
    applySnapshot(baseline);
    setSaveError(false);
  }, [applySnapshot, baseline]);

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (saveInFlight.current) return saveInFlight.current;

    const run = (async () => {
      const subjectId = selectedSubjectRef.current;
      if (!subjectId) return false;

      setSaving(true);
      savingRef.current = true;
      setSaveError(false);

      const savedGrades = { ...grades };
      const savedAchievements = { ...achievements };
      const savedObservations = { ...observations };
      const studentIds = degreeStudentIds;

      const gradesToSave = studentIds
        .filter(
          (studentId) =>
            (savedGrades[studentId]?.trim() !== "" &&
              savedGrades[studentId] !== undefined) ||
            (savedAchievements[studentId]?.trim() !== "" &&
              savedAchievements[studentId] !== undefined) ||
            (savedObservations[studentId]?.trim() !== "" &&
              savedObservations[studentId] !== undefined)
        )
        .map((studentId) => {
          let gradeValue = 0;
          if (savedGrades[studentId] && savedGrades[studentId].trim() !== "") {
            gradeValue = parseFloat(savedGrades[studentId]);
            if (isNaN(gradeValue)) {
              gradeValue = 0;
            }
          }

          return {
            studentId,
            subjectId,
            periodId: period.id,
            value: gradeValue,
            achievements: savedAchievements[studentId] || "",
            observation: savedObservations[studentId] || "",
          };
        });

      if (gradesToSave.length === 0) {
        toast.error(
          "No hay calificaciones, logros o observaciones para guardar",
          SAVE_TOAST
        );
        setSaveError(true);
        setSaving(false);
        savingRef.current = false;
        return false;
      }

      try {
        const result = await saveGrades(gradesToSave);
        if (result.success) {
          toast.success(`Datos guardados exitosamente`, SAVE_TOAST);
          const savedSnapshot: GradeSnapshot = {
            grades: savedGrades,
            achievements: savedAchievements,
            observations: savedObservations,
          };
          setBaseline(cloneSnapshot(savedSnapshot));
          setSavedAt(new Date());
          setSaveError(false);
          rememberSubjectCount(subjectId, savedGrades);
          return true;
        }

        const errorMessage =
          "success" in result && "error" in result
            ? result.error
            : "Error desconocido";
        toast.error(`Error al guardar: ${errorMessage}`, SAVE_TOAST);
        setSaveError(true);
        return false;
      } catch (error) {
        console.error(
          "Error saving grades, achievements, and observations:",
          error
        );
        toast.error(
          "Error al guardar las calificaciones, logros y observaciones",
          SAVE_TOAST
        );
        setSaveError(true);
        return false;
      } finally {
        setSaving(false);
        savingRef.current = false;
      }
    })();

    saveInFlight.current = run;
    try {
      return await run;
    } finally {
      saveInFlight.current = null;
    }
  }, [
    achievements,
    degreeStudentIds,
    grades,
    observations,
    period.id,
    rememberSubjectCount,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      save: handleSave,
      revert: handleRevert,
      changeSubject: (subjectId: string) => {
        void loadSubject(subjectId);
      },
      hasUnsavedChanges: () => changeCountRef.current > 0,
      isSaving: () => savingRef.current,
    }),
    [handleRevert, handleSave, loadSubject]
  );

  const handleGradeChange = (studentId: string, value: string) => {
    if (value === "") {
      setSaveError(false);
      setGrades((prev) => ({ ...prev, [studentId]: value }));
      return;
    }

    const numericRegex = /^([1-5](\.\d{0,1})?)?$/;

    if (numericRegex.test(value)) {
      const numValue = parseFloat(value);
      if (numValue >= 1.0 && numValue <= 5.0) {
        setSaveError(false);
        setGrades((prev) => ({ ...prev, [studentId]: value }));
      }
    }
  };

  const handleAchievementsChange = (studentId: string, value: string) => {
    console.log(value);
    setSaveError(false);
    setAchievements((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleObservationChange = (studentId: string, value: string) => {
    setSaveError(false);
    setObservations((prev) => ({ ...prev, [studentId]: value }));
  };

  const subjectLabel = PREESCOLAR_LEVEL.includes(degree.name)
    ? "DIMENSIONES"
    : "ÁREAS (ASIGNATURAS)";

  const totalStudents = degreeStudentIds.length;

  const chipItems = subjects.map((subject) => {
    const usesDraft = subject.id === selectedSubject && !loading;
    const filled = usesDraft
      ? countStudentsWithGrade(grades, degreeStudentIds)
      : Object.prototype.hasOwnProperty.call(progress.counts, subject.id)
        ? progress.counts[subject.id]
        : progress.status === "ready"
          ? 0
          : null;

    return {
      id: subject.id,
      name: subject.name,
      filled,
      total: totalStudents,
      progressText: formatSubjectProgress(filled, totalStudents, progress.status),
      complete: isSubjectComplete(filled, totalStudents),
      active: subject.id === selectedSubject,
    };
  });

  const saveBarState = resolveSaveBarState({
    saving,
    saveError,
    changeCount,
    savedAt,
  });

  return (
    <>
      <Card className={selectedSubject ? "mb-32" : undefined}>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <CardTitle className="flex flex-wrap items-center gap-2">
              Calificaciones: <Badge className="text-sm">{degree.name}</Badge>
              Periodo:{" "}
              <Badge className="text-sm">
                {period.number}
                {period.year != null ? ` – ${period.year}` : ""}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>

        <SubjectChips
          label={subjectLabel}
          items={chipItems}
          disabled={saving}
          onSelect={(subjectId) => {
            if (subjectId === selectedSubject || saving) return;
            onRequestSubjectChange(subjectId);
          }}
        />

        {selectedSubject ? (
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cargando calificaciones...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900 border-b">
                        <TableHead className="w-[60%] font-bold px-4 py-2	 text-gray-700 dark:text-gray-300">
                          Estudiante
                        </TableHead>
                        <TableHead className="w-[30%] font-bold px-4 py-2 text-gray-700 dark:text-gray-300">
                          Observación General
                        </TableHead>
                        <TableHead className="font-bold w-[5%] px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                          Nota
                        </TableHead>
                        <TableHead className="font-bold w-[5%] px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                          DS
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students
                        .filter((student) => student.degreeId === degree.id)
                        .map((student) => (
                          <TableRow
                            key={student.id}
                            className="border-b hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                          >
                            <TableCell className="w-[60%] p-4 align-bottom">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                                  {student.name}
                                </div>
                              </div>
                              <div className="relative">
                                <label className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                  Logros del estudiante
                                </label>
                                <Textarea
                                  placeholder="Describa los logros del estudiante para esta asignatura..."
                                  value={achievements[student.id] || ""}
                                  onChange={(e) =>
                                    handleAchievementsChange(
                                      student.id,
                                      e.target.value
                                    )
                                  }
                                  className="min-h-[120px] w-full whitespace-pre-wrap border-gray-300 dark:border-gray-700 rounded-md pt-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="w-[30%] p-4 align-bottom">
                              <div className="relative">
                                <label className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                  Observación general
                                </label>
                                <Textarea
                                  placeholder="Observaciones generales sobre el desempeño del estudiante..."
                                  value={observations[student.id] || ""}
                                  onChange={(e) =>
                                    handleObservationChange(
                                      student.id,
                                      e.target.value
                                    )
                                  }
                                  className="min-h-[120px] w-full whitespace-pre-wrap border-gray-300 dark:border-gray-700 rounded-md pt-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="w-[5%] p-4 align-middle text-center">
                              <div className="relative mt-4">
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="1.0"
                                  max="5.0"
                                  placeholder="0.0"
                                  value={grades[student.id] || ""}
                                  onChange={(e) =>
                                    handleGradeChange(
                                      student.id,
                                      e.target.value
                                    )
                                  }
                                  className="w-16 text-center font-bold text-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="block text-xs text-gray-500 mt-1">
                                  /5.0
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="w-[5%] p-4 align-middle text-center">
                              <div className="flex justify-center">
                                {(() => {
                                  const ds = calculateDS(
                                    grades[student.id] || ""
                                  );
                                  if (ds.label) {
                                    return (
                                      <Badge
                                        className={`${ds.color} w-8 text-center h-8`}
                                      >
                                        {ds.label}
                                      </Badge>
                                    );
                                  } else {
                                    return (
                                      <span className="text-gray-400 text-sm">
                                        -
                                      </span>
                                    );
                                  }
                                })()}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        ) : (
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Seleccione una asignatura
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Elija una asignatura del menú desplegable para comenzar a
                  ingresar calificaciones y observaciones para los estudiantes.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {selectedSubject ? (
        <SaveGradesBar
          state={saveBarState}
          disabled={loading || saving}
          onSave={() => {
            void handleSave();
          }}
        />
      ) : null}
    </>
  );
}
