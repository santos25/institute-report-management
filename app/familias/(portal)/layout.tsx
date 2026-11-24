import Image from "next/image";
import { Button } from "@/components/ui/button";
import { logoutGuardian } from "@/lib/auth/guardian-actions";
import { requireGuardian } from "@/lib/auth/guardian-session";

export const dynamic = "force-dynamic";

export default async function FamiliasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const guardian = await requireGuardian();

  return (
    <div className="min-h-screen bg-crema">
      <header className="border-b border-border/70 bg-crema/95">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full bg-card object-contain p-0.5 shadow-sm"
            />
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-tinta">
                Portal de familias
              </p>
              <p className="truncate text-xs text-muted-foreground">{guardian.name}</p>
            </div>
          </div>
          <form action={logoutGuardian}>
            <Button type="submit" variant="outline" size="sm" className="rounded-full">
              Cerrar sesión
            </Button>
          </form>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
