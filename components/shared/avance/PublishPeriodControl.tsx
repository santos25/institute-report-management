"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  publishPeriodForGuardians,
  type PublishPeriodState,
} from "@/lib/actions/period.actions";

export default function PublishPeriodControl({
  periodId,
  published,
  periodNumber,
}: {
  periodId: string;
  published: boolean;
  periodNumber: number;
}) {
  const [state, action, pending] = useActionState(publishPeriodForGuardians, {
    error: "",
    published,
  } satisfies PublishPeriodState);
  const isPublished = published || state.published;

  return (
    <form action={action} className="mt-4 rounded-2xl border border-border bg-card px-4 py-3">
      <input type="hidden" name="periodId" value={periodId} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-tinta">
          {isPublished
            ? `El periodo ${periodNumber} está publicado para las familias.`
            : `Las familias todavía no ven el periodo ${periodNumber}.`}
        </p>
        {isPublished ? (
          <p className="text-sm font-semibold text-azul-800">Publicado para familias</p>
        ) : (
          <Button type="submit" className="rounded-full" disabled={pending}>
            {pending ? "Publicando…" : "Publicar periodo para familias"}
          </Button>
        )}
      </div>
      {state.error ? (
        <p className="mt-2 text-sm text-coral-700" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
