import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
          <p className="text-muted-foreground">
            Instituto Angelitos Alegres
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
