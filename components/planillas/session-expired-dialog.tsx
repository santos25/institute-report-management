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
import { AlertCircle } from "lucide-react";

interface SessionExpiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: () => void;
}

/**
 * Screen 16: Session expired during save
 * Shows when autosave fails due to session expiry
 * Preserves unsaved changes in sessionStorage for recovery after sign-in
 */
export function SessionExpiredDialog({
  open,
  onOpenChange,
  onSignIn,
}: SessionExpiredDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[460px]">
        <div className="flex gap-4">
          <span className="w-11 h-11 rounded-full bg-[#FDECEC] text-[#C81E1E] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold text-[#1B1F3B]">
                Tu sesión expiró
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-1.5 text-sm text-[#596074] leading-relaxed">
                No se pudo guardar porque tu sesión terminó. Tus cambios están
                guardados localmente. Inicia sesión de nuevo para continuar
                editando.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </div>

        <AlertDialogFooter className="mt-6 flex justify-end">
          <Button
            onClick={onSignIn}
            className="h-11 px-5 rounded-full bg-[#5B47E0] text-white font-semibold ring-4 ring-[#5B47E0]/25 hover:bg-[#4A36C7]"
            autoFocus
          >
            Iniciar sesión
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
