"use client";

import { useEffect, useState } from "react";
import { setShowUnsavedChangesDialog } from "@/lib/auth-client";
import { getPlanillaState } from "@/lib/planillas-state";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

interface AffectedStudent {
  name: string;
  reason: "saving" | "invalid" | "error";
  value?: string;
}

/**
 * SignOutGuard component
 * Hooks the unsaved changes dialog into requestSignOut()
 * Place this in the portal layout to enable dialog throughout the portal
 */
export function SignOutGuard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [affectedStudents, setAffectedStudents] = useState<AffectedStudent[]>(
    []
  );
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(
    null
  );
  const [onCancelCallback, setOnCancelCallback] = useState<(() => void) | null>(
    null
  );

  useEffect(() => {
    // Register the dialog handler
    setShowUnsavedChangesDialog(
      (students, onConfirm, onCancel) => {
        setAffectedStudents(students as AffectedStudent[]);
        setOnConfirmCallback(() => onConfirm);
        setOnCancelCallback(() => onCancel);
        setDialogOpen(true);
      }
    );

    return () => {
      setShowUnsavedChangesDialog(null);
    };
  }, []);

  const handleConfirm = () => {
    setDialogOpen(false);
    if (onConfirmCallback) {
      onConfirmCallback();
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    if (onCancelCallback) {
      onCancelCallback();
    }
  };

  const state = getPlanillaState();

  return (
    <UnsavedChangesDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      affectedStudents={affectedStudents}
      gradoName={state?.gradoName}
      areaName={state?.areaName}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}
