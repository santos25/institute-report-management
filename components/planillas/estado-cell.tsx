"use client";

import { Check, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface EstadoCellProps {
  notaStatus: "idle" | "editing" | "saving" | "saved" | "error" | "invalid";
  logrosStatus: "idle" | "editing" | "saving" | "saved" | "error" | "invalid";
  observacionStatus: "idle" | "editing" | "saving" | "saved" | "error" | "invalid";
  onRetry: () => void;
}

export function EstadoCell({
  notaStatus,
  logrosStatus,
  observacionStatus,
  onRetry,
}: EstadoCellProps) {
  // Priority: error/invalid > saving > editing > saved > idle
  const statuses = [notaStatus, logrosStatus, observacionStatus];

  if (statuses.includes("invalid")) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#A51818]">
        <AlertCircle className="w-3.5 h-3.5" />
        Nota no válida
      </span>
    );
  }

  if (statuses.includes("error")) {
    return (
      <span className="flex flex-col items-start leading-tight">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#A51818]">
          <AlertCircle className="w-3.5 h-3.5" />
          Error al guardar
        </span>
        <button
          onClick={onRetry}
          className="mt-0.5 text-xs font-semibold text-[#4A36C7] underline underline-offset-2 inline-flex items-center gap-1 hover:text-[#5B47E0]"
        >
          <RefreshCw className="w-3 h-3" />
          Reintentar
        </button>
      </span>
    );
  }

  if (statuses.includes("saving")) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#596074]">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Guardando…
      </span>
    );
  }

  if (statuses.includes("editing")) {
    return (
      <span className="text-xs font-medium text-[#4A36C7]">Editando…</span>
    );
  }

  if (statuses.includes("saved")) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#146C36]">
        <Check className="w-3.5 h-3.5" />
        Guardado
      </span>
    );
  }

  // Idle - show subtle checkmark
  return (
    <span className="text-[#146C36]/70" title="Guardado">
      <Check className="w-3.5 h-3.5" />
    </span>
  );
}
