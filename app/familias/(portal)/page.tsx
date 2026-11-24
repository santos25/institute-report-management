import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireGuardian } from "@/lib/auth/guardian-session";
import { listGuardianChildren } from "@/lib/guardian/children";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mis hijos | Angelitos Alegres",
};

export default async function FamiliasPage() {
  const guardian = await requireGuardian();
  if (guardian.mustChangePassword) redirect("/familias/cambiar-clave");

  const children = await listGuardianChildren(guardian.id);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-tinta">Tus hijos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Elige un hijo para ver las notas, los logros y la observación del año en curso.
      </p>
      {children.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-border bg-card px-4 py-6 text-sm text-tinta">
          Todavía no hay estudiantes vinculados. El colegio debe asociarlos a esta cuenta.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {children.map((child) => (
            <li key={child.id}>
              <Link
                href={`/familias/hijos/${child.id}`}
                prefetch={false}
                className="block rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:bg-crema-50"
              >
                <p className="font-display text-lg font-semibold text-tinta">{child.name}</p>
                <p className="text-sm text-muted-foreground">{child.degreeName}</p>
                <p className="mt-2 text-sm font-semibold text-azul-700">Ver notas</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
