"use client";

import { useActionState } from "react";
import {
  changeGuardianPasswordAction,
  type GuardianFormState,
} from "@/lib/auth/guardian-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: GuardianFormState = { error: "" };

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changeGuardianPasswordAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="password">Nueva clave</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmation">Confirmar clave</Label>
        <Input
          id="confirmation"
          name="confirmation"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="h-10 w-full rounded-full" disabled={pending}>
        {pending ? "Guardando…" : "Crear mi clave"}
      </Button>
    </form>
  );
}
