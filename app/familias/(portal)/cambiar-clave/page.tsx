import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireGuardian } from "@/lib/auth/guardian-session";
import { ChangePasswordForm } from "./change-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Crear clave | Angelitos Alegres",
};

export default async function ChangeGuardianPasswordPage() {
  const guardian = await requireGuardian();
  if (!guardian.mustChangePassword) redirect("/familias");

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-tinta">Crea tu clave</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        La clave inicial solo sirve para este primer ingreso. Elige una clave propia
        de al menos 8 caracteres.
      </p>
      <div className="mt-6 rounded-3xl border border-border bg-card px-6 py-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
