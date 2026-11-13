"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authenticate } from "@/lib/actions/auth.actions";
import { sanitizeCallbackUrl } from "@/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const estado = searchParams.get("estado");
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("next");
  const sanitizedCallback = sanitizeCallbackUrl(callbackUrl);

  useEffect(() => {
    // Strip estado from URL after first render to prevent showing on reload
    if (estado && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("estado");
      window.history.replaceState({}, "", url.toString());
    }

    // Focus the appropriate field
    if (estado === "sesion-expirada" && passwordRef.current) {
      // For expired session, focus password (email will be prefilled)
      passwordRef.current.focus();
    } else if (emailRef.current) {
      emailRef.current.focus();
    }
  }, [estado]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await authenticate(formData, sanitizedCallback);

      if (result?.error) {
        setError(result.error);
      } else {
        // Successful login - navigate to callback or default
        const destination = result?.callbackUrl || sanitizedCallback || "/";
        router.push(destination);
        router.refresh();
      }
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  }

  const handleEmailFocus = () => {
    if (estado === "sesion-cerrada") {
      setShowNotice(false);
    }
  };

  return (
    <div className="space-y-4">
      {estado === "sesion-cerrada" && showNotice && (
        <Alert variant="success" role="status" className="relative">
          <Check className="h-4 w-4" />
          <AlertTitle>Sesión cerrada correctamente</AlertTitle>
          <AlertDescription>
            Por seguridad, cierra también el navegador si usas un computador
            compartido.
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 rounded-full"
            onClick={() => setShowNotice(false)}
            aria-label="Cerrar aviso"
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      {estado === "sesion-expirada" && (
        <Alert variant="warning" role="alert">
          <Clock className="h-4 w-4" />
          <AlertTitle>Tu sesión expiró</AlertTitle>
          <AlertDescription>
            {callbackUrl ? (
              <>
                Inicia sesión de nuevo para volver a{" "}
                <strong>{getDestinationLabel(callbackUrl)}</strong>.
              </>
            ) : (
              "Inicia sesión de nuevo para continuar."
            )}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo Electrónico
          </label>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
            className="w-full rounded-md border px-3 py-2"
            disabled={isLoading}
            onFocus={handleEmailFocus}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <input
            ref={passwordRef}
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
    </div>
  );
}

function getDestinationLabel(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin);
    const path = parsed.pathname;

    if (path.startsWith("/planillas")) {
      return "Planillas";
    }
    if (path.startsWith("/boletines")) {
      return "Boletines";
    }
    return "el portal";
  } catch {
    return "el portal";
  }
}
