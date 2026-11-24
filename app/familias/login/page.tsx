import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { GuardianLoginForm } from "@/app/familias/login/login-form";
import { readCurrentGuardian } from "@/lib/auth/guardian-session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portal de familias | Angelitos Alegres",
};

export default async function GuardianLoginPage() {
  const guardian = await readCurrentGuardian();
  if (guardian?.mustChangePassword) redirect("/familias/cambiar-clave");
  if (guardian) redirect("/familias");

  return (
    <main className="flex min-h-screen items-center justify-center bg-crema px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card px-6 py-8 shadow-sm sm:px-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt=""
            width={72}
            height={72}
            priority
            className="size-16 rounded-full bg-card object-contain p-1 shadow-sm"
          />
          <h1 className="mt-4 font-display text-3xl font-semibold text-tinta">
            Portal de familias
          </h1>
          <p className="mt-2 text-balance text-sm text-muted-foreground">
            Ingresa con tu cédula y la clave que te entregó el Instituto Angelitos Alegres.
          </p>
        </div>
        <GuardianLoginForm />
      </div>
    </main>
  );
}
