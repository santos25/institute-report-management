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
import { getObservationSummary } from "@/lib/actions/observation.actions";
import { PREESCOLAR_LEVEL } from "@/lib/constant";
import { OBSERVATIONS_NAV_ID } from "@/lib/observation-draft";
import { calculateDS } from "@/lib/utils";
import ObservationEntry, {
  type ObservationEntryHandle,
} from "@/components/shared/planilla/ObservationEntry";
import SaveGradesBar from "@/components/shared/planilla/SaveGradesBar";
import SubjectNav from "@/components/shared/planilla/SubjectNav";
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
  const [panel, setPanel] = useState<"subject" | "observations">("subject");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [achievements, setAchievements] = useState<Record<string, string>>({});
  const [baseline, setBaseline] = useState<GradeSnapshot>(EMPTY_GRADE_SNAPSHOT);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [observationDirty, setObservationDirty] = useState(false);
  const [observationSaving, setObservationSaving] = useState(false);
  const [progress, setProgress] = useState<{
    status: "loading" | "ready" | "error";
    counts: Record<string, number>;
  }>({ status: "loading", counts: {} });
  const [observationProgress, setObservationProgress] = useState<{
    status: "loading" | "ready" | "error";
    filled: number | null;
  }>({ status: "loading", filled: null });

  const requestSeq = useRef(0);
  const saveInFlight = useRef<Promise<boolean> | null>(null);
  const selectedSubjectRef = useRef(selectedSubject);
  const panelRef = useRef(panel);
  const savingRef = useRef(saving);
  const degreeStudentIdsRef = useRef<string[]>([]);
  const observationRef = useRef<ObservationEntryHandle>(null);
  const observationDraftRef = useRef(false);

  const degreeStudentIds = useMemo(
    () =>
      students
        .filter((student) => student.degreeId === degree.id)
        .map((student) => student.id),
    [students, degree.id]
  );

  degreeStudentIdsRef.current = degreeStudentIds;
  selectedSubjectRef.current = selectedSubject;
  panelRef.current = panel;
  savingRef.current = saving;

  const changeCount = useMemo(
    () => countFieldChanges({ grades, achievements }, baseline, degreeStudentIds),
    [grades, achievements, baseline, degreeStudentIds]
  );

  const changeCountRef = useRef(changeCount);
  changeCountRef.current = changeCount;

  const applySnapshot = useCallback((snapshot: GradeSnapshot) => {
    const next = cloneSnapshot(snapshot);
    setGrades(next.grades);
    setAchievements(next.achievements);
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
    observationDraftRef.current = false;

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

    getObservationSummary(degree.id, period.id).then((result) => {
      if (cancelled || observationDraftRef.current) return;
      if (!result.success) {
        setObservationProgress((current) =>
          observationDraftRef.current
            ? current
            : { status: "error", filled: current.filled }
        );
        return;
      }
      setObservationProgress((current) =>
        observationDraftRef.current
          ? current
          : { status: "ready", filled: result.filled }
      );
    });

    return () => {
      cancelled = true;
    };
  }, [degree.id, period.id]);

  useEffect(() => {
    if (changeCount === 0 && !observationDirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [changeCount, observationDirty]);

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
        };

        Object.entries(result.data).forEach(([studentId, data]) => {
          next.grades[studentId] = data.grade ? data.grade.toString() : "";
          next.achievements[studentId] = data.achievements;
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
      const studentIds = degreeStudentIds;

      const gradesToSave = studentIds
        .filter(
          (studentId) =>
            (savedGrades[studentId]?.trim() !== "" &&
              savedGrades[studentId] !== undefined) ||
            (savedAchievements[studentId]?.trim() !== "" &&
              savedAchievements[studentId] !== undefined)
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
          };
        });

      if (gradesToSave.length === 0) {
        toast.error(
          "No hay calificaciones o logros para guardar",
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
        console.error("Error saving grades and achievements:", error);
        toast.error(
          "Error al guardar las calificaciones y logros",
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
    period.id,
    rememberSubjectCount,
  ]);

  const openView = useCallback(
    (nextId: string) => {
      if (savingRef.current || observationRef.current?.isSaving()) return;

      if (nextId === OBSERVATIONS_NAV_ID) {
        if (panelRef.current === "observations") return;
        panelRef.current = "observations";
        setPanel("observations");
        return;
      }

      panelRef.current = "subject";
      setPanel("subject");
      void loadSubject(nextId);
    },
    [loadSubject]
  );

  useImperativeHandle(
    ref,
    () => ({
      save: () => {
        if (panelRef.current === "observations") {
          return observationRef.current?.save() ?? Promise.resolve(false);
        }
        return handleSave();
      },
      revert: () => {
        if (panelRef.current === "observations") {
          observationRef.current?.revert();
          return;
        }
        handleRevert();
      },
      changeSubject: (subjectId: string) => {
        openView(subjectId);
      },
      hasUnsavedChanges: () => {
        if (panelRef.current === "observations") {
          return observationRef.current?.hasUnsavedChanges() ?? false;
        }
        return changeCountRef.current > 0;
      },
      isSaving: () =>
        savingRef.current || (observationRef.current?.isSaving() ?? false),
    }),
    [handleRevert, handleSave, openView]
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

  const subjectLabel = PREESCOLAR_LEVEL.includes(degree.name)
    ? "DIMENSIONES"
    : "ÁREAS (ASIGNATURAS)";

  const totalStudents = degreeStudentIds.length;

  const chipItems = subjects.map((subject) => {
    const usesDraft =
      panel === "subject" && subject.id === selectedSubject && !loading;
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
      active: panel === "subject" && subject.id === selectedSubject,
    };
  });

  const observationFilled = observationProgress.filled;
  const observationItem = {
    id: OBSERVATIONS_NAV_ID,
    name: "Observaciones generales",
    filled: observationFilled,
    total: totalStudents,
    progressText: formatSubjectProgress(
      observationFilled,
      totalStudents,
      observationProgress.status
    ),
    complete: isSubjectComplete(observationFilled, totalStudents),
    active: panel === "observations",
    keepCount: true,
    description:
      observationFilled == null
        ? "Observaciones generales, cargando"
        : `Observaciones generales, ${observationFilled} de ${totalStudents} con observación`,
  };

  const handleObservationFilled = useCallback((filled: number) => {
    observationDraftRef.current = true;
    setObservationProgress({ status: "ready", filled });
  }, []);

  const handleObservationDirty = useCallback((dirty: boolean) => {
    setObservationDirty(dirty);
  }, []);

  const handleObservationSaving = useCallback((next: boolean) => {
    setObservationSaving(next);
  }, []);

  const navDisabled = saving || observationSaving;

  const saveBarState = resolveSaveBarState({
    saving,
    saveError,
    changeCount,
    savedAt,
  });

  const showGradeBar = panel === "subject" && Boolean(selectedSubject);

  return (
    <>
      <Card className={showGradeBar || panel === "observations" ? "mb-32 gap-0" : "gap-0"}>
        <CardHeader className="pb-5">
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

        <div className="border-t border-border lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
          <SubjectNav
            label={subjectLabel}
            items={chipItems}
            footerLabel="OBSERVACIONES"
            footerItems={[observationItem]}
            disabled={navDisabled}
            onSelect={(nextId) => {
              if (navDisabled) return;
              if (nextId === OBSERVATIONS_NAV_ID) {
                if (panel === "observations") return;
                onRequestSubjectChange(nextId);
                return;
              }
              if (panel === "subject" && nextId === selectedSubject) return;
              onRequestSubjectChange(nextId);
            }}
          />

          {panel === "observations" ? (
            <ObservationEntry
              ref={observationRef}
              degreeId={degree.id}
              periodId={period.id}
              onFilledChange={handleObservationFilled}
              onDirtyChange={handleObservationDirty}
              onSavingChange={handleObservationSaving}
            />
          ) : selectedSubject ? (
            <CardContent className="min-w-0 p-4 sm:p-6">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                      Cargando calificaciones...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="overflow-x-auto rounded-lg border bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted border-b">
                          <TableHead className="font-bold px-4 py-2 text-foreground">
                            Estudiante
                          </TableHead>
                          <TableHead className="font-bold w-[5.5rem] px-4 py-2 text-center text-foreground">
                            Nota
                          </TableHead>
                          <TableHead className="font-bold w-[4.5rem] px-4 py-2 text-center text-foreground">
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
                              className="border-b hover:bg-azul-50 transition-colors"
                            >
                              <TableCell className="p-4 align-bottom">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="font-bold text-foreground text-sm">
                                    {student.name}
                                  </div>
                                </div>
                                <div className="relative">
                                  <label className="absolute -top-2 left-3 bg-card px-1 text-xs font-medium text-muted-foreground">
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
                                    className="min-h-[120px] w-full whitespace-pre-wrap border-input rounded-md pt-3 focus:ring-2 focus:ring-ring focus:border-ring"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="p-4 align-middle text-center">
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
                                    className="w-16 text-center font-bold text-lg border-input focus:ring-2 focus:ring-ring focus:border-ring"
                                  />
                                  <span className="block text-xs text-muted-foreground mt-1">
                                    /5.0
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="p-4 align-middle text-center">
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
                                        <span className="text-muted-foreground text-sm">
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
            <CardContent className="min-w-0 py-16">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
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
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Seleccione una asignatura
                  </h3>
                  <p className="text-muted-foreground">
                    Elija una asignatura para ingresar calificaciones, u
                    Observaciones generales para la observación del periodo.
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </div>
      </Card>

      {showGradeBar ? (
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
