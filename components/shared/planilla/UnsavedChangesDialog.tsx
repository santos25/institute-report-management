"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UnsavedChangesDialogProps = {
  open: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
};

export default function UnsavedChangesDialog({
  open,
  saving,
  onSave,
  onDiscard,
  onCancel,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !saving) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Cambios sin guardar</DialogTitle>
          <DialogDescription>
            Tienes cambios sin guardar. Puedes guardarlos y continuar,
            descartarlos o cancelar para seguir editando.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:flex-wrap">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={onDiscard}
            disabled={saving}
          >
            Descartar cambios
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Guardando…" : "Guardar y continuar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
