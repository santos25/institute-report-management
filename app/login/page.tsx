import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { getHeaderUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Iniciar sesión | Angelitos Alegres",
};

export default async function LoginPage() {
  const user = await getHeaderUser();
  if (user) redirect("/planillas");

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
            Iniciar sesión
          </h1>
          <p className="mt-2 text-balance text-sm text-muted-foreground">
            Portal de docentes y administración del Instituto Angelitos Alegres
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
