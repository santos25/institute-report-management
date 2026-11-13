"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, AlertCircle } from "lucide-react";

interface AffectedStudent {
  name: string;
  reason: "saving" | "invalid" | "error";
  value?: string;
}

interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affectedStudents: AffectedStudent[];
  gradoName?: string;
  areaName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onRetry?: (studentName: string) => void;
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  affectedStudents,
  gradoName = "Primero",
  areaName = "Matemáticas",
  onConfirm,
  onCancel,
  onRetry,
}: UnsavedChangesDialogProps) {
  const count = affectedStudents.length;

  const getReasonText = (reason: string, value?: string) => {
    switch (reason) {
      case "saving":
        return "guardando…";
      case "invalid":
        return `nota no válida${value ? ` (${value})` : ""}`;
      case "error":
        return "error de conexión";
      default:
        return "sin guardar";
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case "saving":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "invalid":
      case "error":
        return <AlertCircle className="w-4 h-4 text-[#A51818]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#596074]" />;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[500px]">
        <div className="flex gap-4">
          <span className="w-11 h-11 rounded-full bg-[#FFF6E5] text-[#B45309] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold text-[#1B1F3B]">
                ¿Cerrar sesión con cambios sin guardar?
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-1.5 text-sm text-[#596074] leading-relaxed">
                Hay {count} cambios en{" "}
                <b className="text-[#1F2433]">
                  {gradoName} · {areaName}
                </b>{" "}
                que todavía no se guardaron. Si cierras sesión ahora, se
                perderán.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {affectedStudents.length > 0 && (
              <ul
                className="mt-3 space-y-2 text-sm"
                aria-live="polite"
                aria-atomic="false"
              >
                {affectedStudents.map((student, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 rounded-lg bg-[#F7F7FB] px-3 py-2"
                  >
                    <span className="text-[#596074]">
                      {getReasonIcon(student.reason)}
                    </span>
                    <span className="flex-1">
                      <b>{student.name}</b> · {getReasonText(student.reason, student.value)}
                    </span>
                    {student.reason === "error" && onRetry && (
                      <button
                        onClick={() => onRetry(student.name)}
                        className="text-xs font-semibold text-[#4A36C7] underline underline-offset-2"
                      >
                        Reintentar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <AlertDialogFooter className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onConfirm}
            className="h-11 px-4 rounded-full border border-[#C81E1E]/40 text-[#A51818] font-semibold hover:bg-[#FDECEC]"
          >
            Cerrar sesión de todas formas
          </Button>
          <Button
            onClick={onCancel}
            className="h-11 px-5 rounded-full bg-[#5B47E0] text-white font-semibold ring-4 ring-[#5B47E0]/25 hover:bg-[#4A36C7]"
            autoFocus
          >
            Volver y revisar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
