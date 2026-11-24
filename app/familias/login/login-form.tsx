"use client";

import { useActionState } from "react";
import { loginGuardian, type GuardianFormState } from "@/lib/auth/guardian-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: GuardianFormState = { error: "" };

export function GuardianLoginForm() {
  const [state, formAction, pending] = useActionState(loginGuardian, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="identification">Cédula</Label>
        <Input
          id="identification"
          name="identification"
          inputMode="numeric"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Clave</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="h-10 w-full rounded-full" disabled={pending}>
        {pending ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
