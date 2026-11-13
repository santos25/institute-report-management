"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "@/lib/actions/auth.actions";

export function LoginForm() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await authenticate(formData);
      
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Correo Electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="correo@ejemplo.com"
          required
          className="w-full rounded-md border px-3 py-2"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border px-3 py-2"
          disabled={isLoading}
        />
      </div>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>
    </form>
  );
}
