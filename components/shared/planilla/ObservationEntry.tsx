"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getDegreeObservations,
  saveDegreeObservations,
} from "@/lib/actions/observation.actions";
import {
  applyCommonText,
  changedObservations,
  cloneObservationDraft,
  commonUpdateCount,
  countUsingCommon,
  countWithObservation,
  createObservationDraft,
  linkRowToCommon,
  markObservationSaved,
  matchesObservationFilter,
  normalizeObservation,
  observationChangeCount,
  observationStatus,
  personalizeRow,
  type ObservationDraft,
  type ObservationFilter,
  type ObservationRow,
} from "@/lib/observation-draft";
import { cn } from "@/lib/utils";
import SaveGradesBar from "@/components/shared/planilla/SaveGradesBar";
import { resolveSaveBarState } from "@/components/shared/planilla/grade-entry-utils";

export type ObservationEntryHandle = {
  save: () => Promise<boolean>;
  revert: () => void;
  hasUnsavedChanges: () => boolean;
  isSaving: () => boolean;
};

type ObservationEntryProps = {
  ref?: Ref<ObservationEntryHandle>;
  degreeId: string;
  periodId: string;
  onFilledChange: (filled: number) => void;
  onDirtyChange: (dirty: boolean) => void;
  onSavingChange: (saving: boolean) => void;
};

const FILTERS: { id: ObservationFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "comun", label: "Común" },
  { id: "personalizadas", label: "Personalizadas" },
  { id: "vacia", label: "Sin observación" },
];

const SAVE_TOAST = {
  style: { marginBottom: "7.5rem" },
};

const EMPTY_DRAFT: ObservationDraft = { commonText: "", rows: [] };

function statusLabel(status: ReturnType<typeof observationStatus>): string {
  if (status === "comun") return "Común";
  if (status === "personalizada") return "Personalizada";
  return "Sin observación";
}

export default function ObservationEntry({
  ref,
  degreeId,
  periodId,
  onFilledChange,
  onDirtyChange,
  onSavingChange,
}: ObservationEntryProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [commonText, setCommonText] = useState("");
  const [rows, setRows] = useState<ObservationRow[]>([]);
  const [baseline, setBaseline] = useState<ObservationDraft>(EMPTY_DRAFT);
  const [filter, setFilter] = useState<ObservationFilter>("todos");
  const [saving, setSaving] = useState(false);
  const [locked, setLocked] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [confirmCount, setConfirmCount] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const requestSeq = useRef(0);
  const saveInFlight = useRef<Promise<boolean> | null>(null);
  const savingRef = useRef(false);
  const lockedRef = useRef(false);
  const confirmRef = useRef<{ resolve: (accepted: boolean) => void } | null>(
    null
  );
  const draftRef = useRef({ commonText, rows, baseline });

  draftRef.current = { commonText, rows, baseline };
  savingRef.current = saving;

  const filled = countWithObservation(rows, commonText);
  const usingCommon = countUsingCommon(rows, commonText);
  const changeCount = observationChangeCount(rows, commonText);
  const visibleRows = rows.filter((row) =>
    matchesObservationFilter(row, commonText, filter)
  );

  useEffect(() => {
    if (status !== "ready") return;
    onFilledChange(filled);
  }, [filled, onFilledChange, status]);

  useEffect(() => {
    if (status !== "ready") return;
    onDirtyChange(changeCount > 0);
  }, [changeCount, onDirtyChange, status]);

  useEffect(() => {
    onSavingChange(saving || locked);
  }, [locked, onSavingChange, saving]);

  useEffect(() => {
    return () => onSavingChange(false);
  }, [onSavingChange]);

  useEffect(() => {
    const seq = ++requestSeq.current;
    setStatus("loading");
    setErrorMessage("");
    setSaveError(false);
    setSavedAt(null);
    setFilter("todos");

    getDegreeObservations(degreeId, periodId).then((result) => {
      if (seq !== requestSeq.current) return;

      if (!result.success) {
        setStatus("error");
        setErrorMessage(result.error || "No se pudieron cargar las observaciones.");
        setCanEdit(false);
        setCommonText("");
        setRows([]);
        setBaseline(EMPTY_DRAFT);
        return;
      }

      const draft = createObservationDraft(result.students);
      setCanEdit(result.canEdit);
      setCommonText(draft.commonText);
      setRows(draft.rows);
      setBaseline(cloneObservationDraft(draft));
      setStatus("ready");
    });

    return () => {
      requestSeq.current += 1;
    };
  }, [degreeId, periodId, reloadKey]);

  const finishConfirm = useCallback((accepted: boolean) => {
    const pending = confirmRef.current;
    if (!pending) return;
    confirmRef.current = null;
    setConfirmCount(null);
    pending.resolve(accepted);
  }, []);

  const askConfirm = useCallback((count: number) => {
    return new Promise<boolean>((resolve) => {
      confirmRef.current = { resolve };
      setConfirmCount(count);
    });
  }, []);

  const applyBaseline = useCallback((draft: ObservationDraft) => {
    const next = cloneObservationDraft(draft);
    setCommonText(next.commonText);
    setRows(next.rows);
    setBaseline(cloneObservationDraft(draft));
    setSaveError(false);
  }, []);

  const handleRevert = useCallback(() => {
    applyBaseline(draftRef.current.baseline);
    onDirtyChange(false);
  }, [applyBaseline, onDirtyChange]);

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (saveInFlight.current) return saveInFlight.current;

    const run = (async () => {
      const current = draftRef.current;
      if (!canEdit) return false;

      lockedRef.current = true;
      setLocked(true);

      try {
        const updates = commonUpdateCount(
          current.rows,
          current.baseline.commonText,
          current.commonText
        );

        if (updates > 0) {
          const accepted = await askConfirm(updates);
          if (!accepted) return false;
        }

        const latest = draftRef.current;
        const changes = changedObservations(latest.rows, latest.commonText);
        if (changes.length === 0) return true;

        setSaving(true);
        savingRef.current = true;
        setSaveError(false);

        const result = await saveDegreeObservations({
          degreeId,
          periodId,
          observations: changes,
        });

        if (!result.success) {
          toast.error(
            result.error || "Error al guardar las observaciones",
            SAVE_TOAST
          );
          setSaveError(true);
          return false;
        }

        const savedCommon = normalizeObservation(latest.commonText);
        const savedRows = markObservationSaved(latest.rows, savedCommon);
        const savedDraft = { commonText: savedCommon, rows: savedRows };
        setCommonText(savedCommon);
        setRows(savedRows);
        setBaseline(cloneObservationDraft(savedDraft));
        setSavedAt(new Date());
        setSaveError(false);
        onDirtyChange(false);
        toast.success("Observaciones guardadas", SAVE_TOAST);
        return true;
      } catch (error) {
        console.error("Error al guardar las observaciones:", error);
        toast.error("Error al guardar las observaciones", SAVE_TOAST);
        setSaveError(true);
        return false;
      } finally {
        lockedRef.current = false;
        savingRef.current = false;
        setLocked(false);
        setSaving(false);
      }
    })();

    saveInFlight.current = run;
    try {
      return await run;
    } finally {
      saveInFlight.current = null;
    }
  }, [askConfirm, canEdit, degreeId, onDirtyChange, periodId]);

  useImperativeHandle(
    ref,
    () => ({
      save: handleSave,
      revert: handleRevert,
      hasUnsavedChanges: () =>
        observationChangeCount(
          draftRef.current.rows,
          draftRef.current.commonText
        ) > 0,
      isSaving: () => savingRef.current || lockedRef.current,
    }),
    [handleRevert, handleSave]
  );

  const handleCommonChange = (value: string) => {
    setSaveError(false);
    setRows((current) =>
      applyCommonText(
        current,
        commonText,
        value,
        draftRef.current.baseline.commonText
      )
    );
    setCommonText(value);
  };

  const keepRowVisible = (row: ObservationRow, text = commonText) => {
    setFilter((current) =>
      matchesObservationFilter(row, text, current) ? current : "todos"
    );
  };

  const handlePersonalize = (studentId: string) => {
    setSaveError(false);
    const source = rows.find((row) => row.studentId === studentId);
    if (!source) return;
    const next = personalizeRow(source, commonText);
    setRows((current) =>
      current.map((row) => (row.studentId === studentId ? next : row))
    );
    keepRowVisible(next);
  };

  const handleUseCommon = (studentId: string) => {
    setSaveError(false);
    const source = rows.find((row) => row.studentId === studentId);
    if (!source) return;
    const next = linkRowToCommon(source);
    setRows((current) =>
      current.map((row) => (row.studentId === studentId ? next : row))
    );
    keepRowVisible(next);
  };

  const handleCustomChange = (studentId: string, value: string) => {
    setSaveError(false);
    setRows((current) =>
      current.map((row) =>
        row.studentId === studentId ? { ...row, customText: value } : row
      )
    );
  };

  const saveBarState = resolveSaveBarState({
    saving,
    saveError,
    changeCount,
    savedAt,
  });

  return (
    <>
      <div className="min-w-0 p-4 sm:p-6">
        {status === "loading" ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Cargando observaciones...</p>
            </div>
          </div>
        ) : status === "error" ? (
          <div className="py-16 text-center">
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => setReloadKey((current) => current + 1)}
            >
              Reintentar
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Observaciones generales
              </h2>
              {!canEdit ? (
                <p className="mt-1 text-sm text-muted-foreground">Solo lectura.</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacion-comun">Observación común</Label>
              <Textarea
                id="observacion-comun"
                value={commonText}
                onChange={(event) => handleCommonChange(event.target.value)}
                readOnly={!canEdit}
                disabled={saving || locked}
                placeholder="Observación que comparte el grado en este periodo..."
                className="min-h-[120px] w-full whitespace-pre-wrap border-input bg-card"
              />
              <p className="text-sm text-muted-foreground" aria-live="polite">
                Se usa para {usingCommon} de {rows.length} estudiantes
              </p>
            </div>

            <div
              role="group"
              aria-label="Filtrar estudiantes"
              className="flex flex-wrap gap-2"
            >
              {FILTERS.map((item) => {
                const selected = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(item.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected
                        ? "border-azul-500 bg-azul-50 font-semibold text-azul-700"
                        : "border-border bg-card text-foreground hover:bg-muted"
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {visibleRows.length === 0 ? (
              <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                Ningún estudiante con este filtro.
              </p>
            ) : (
              <ul className="space-y-3">
                {visibleRows.map((row) => {
                  const rowStatus = observationStatus(row, commonText);
                  const showPersonalize =
                    canEdit && (row.mode === "common" || row.mode === "empty");
                  const showReturn =
                    canEdit &&
                    row.mode !== "common" &&
                    (row.mode === "custom" ||
                      normalizeObservation(commonText) !== "");

                  return (
                    <li
                      key={row.studentId}
                      className="rounded-lg border bg-card p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <p className="font-bold text-foreground">{row.name}</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              rowStatus === "comun" &&
                                "border-azul-200 bg-azul-50 text-azul-700",
                              rowStatus === "personalizada" &&
                                "border-sol-300 bg-sol-100 text-tinta",
                              rowStatus === "vacia" && "text-muted-foreground"
                            )}
                          >
                            {statusLabel(rowStatus)}
                          </Badge>
                        </div>
                        {showPersonalize || showReturn ? (
                          <div className="flex shrink-0 flex-wrap gap-2">
                            {showPersonalize ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={saving || locked}
                                onClick={() => handlePersonalize(row.studentId)}
                              >
                                Personalizar
                              </Button>
                            ) : null}
                            {showReturn ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={saving || locked}
                                onClick={() => handleUseCommon(row.studentId)}
                              >
                                Volver a la común
                              </Button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>

                      {row.mode === "custom" ? (
                        <Textarea
                          aria-label={`Observación de ${row.name}`}
                          value={row.customText}
                          onChange={(event) =>
                            handleCustomChange(row.studentId, event.target.value)
                          }
                          readOnly={!canEdit}
                          disabled={saving || locked}
                          placeholder="Observación de este estudiante..."
                          className="mt-3 min-h-[100px] w-full whitespace-pre-wrap border-input bg-card"
                        />
                      ) : rowStatus === "comun" ? (
                        <p className="mt-3 line-clamp-2 whitespace-pre-wrap text-sm text-foreground">
                          {normalizeObservation(commonText)}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {status === "ready" && canEdit ? (
        <SaveGradesBar
          state={saveBarState}
          disabled={saving || locked}
          saveLabel="Guardar observaciones"
          regionLabel="Guardar observaciones"
          onSave={() => {
            void handleSave();
          }}
        />
      ) : null}

      <Dialog
        open={confirmCount !== null}
        onOpenChange={(open) => {
          if (!open) finishConfirm(false);
        }}
      >
        <DialogContent
          overlayStyle={{ zIndex: 80 }}
          style={{ zIndex: 90 }}
          className="bg-card sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Actualizar observación común</DialogTitle>
            <DialogDescription className="text-base text-foreground">
              Se actualizará la observación de {confirmCount ?? 0}{" "}
              {confirmCount === 1 ? "estudiante" : "estudiantes"}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => finishConfirm(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={() => finishConfirm(true)}>
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
