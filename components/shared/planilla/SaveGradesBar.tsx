"use client";

import { Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getSaveBarLabel,
  type SaveBarState,
} from "@/components/shared/planilla/grade-entry-utils";

type SaveGradesBarProps = {
  state: SaveBarState;
  disabled?: boolean;
  onSave: () => void;
};

export default function SaveGradesBar({
  state,
  disabled = false,
  onSave,
}: SaveGradesBarProps) {
  const label = getSaveBarLabel(state);

  return (
    <div
      role="region"
      aria-label="Guardar calificaciones"
      data-save-state={state.kind}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "flex items-center gap-2 text-sm",
            state.kind === "clean" && "text-muted-foreground",
            state.kind === "dirty" && "font-medium text-foreground",
            state.kind === "saving" && "font-medium text-primary",
            state.kind === "saved" && "font-medium text-hoja-700 dark:text-hoja-300",
            state.kind === "error" && "font-medium text-destructive"
          )}
        >
          {state.kind === "dirty" ? (
            <span className="size-2 shrink-0 rounded-full bg-sol-500" aria-hidden />
          ) : null}
          {state.kind === "saving" ? (
            <LoaderCircle className="size-4 shrink-0 animate-spin" aria-hidden />
          ) : null}
          {state.kind === "saved" ? (
            <Check className="size-4 shrink-0" strokeWidth={3} aria-hidden />
          ) : null}
          {label}
        </p>
        <Button
          type="button"
          onClick={onSave}
          disabled={disabled}
          className="w-full font-medium shadow-sm sm:w-auto"
        >
          Guardar Calificaciones
        </Button>
      </div>
    </div>
  );
}
