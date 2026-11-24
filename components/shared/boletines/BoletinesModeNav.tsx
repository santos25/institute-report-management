import Link from "next/link";
import { cn } from "@/lib/utils";

const MODES = [
  { href: "/boletines", id: "periodo", label: "Por periodo" },
  { href: "/boletines/final", id: "final", label: "Boletín final del año" },
] as const;

export default function BoletinesModeNav({
  current,
  className,
}: {
  current: (typeof MODES)[number]["id"];
  className?: string;
}) {
  return (
    <nav
      aria-label="Tipo de boletín"
      className={cn(
        "mb-4 inline-flex max-w-full flex-wrap rounded-lg bg-muted p-1",
        className
      )}
    >
      {MODES.map((mode) => {
        const active = mode.id === current;
        return (
          <Link
            key={mode.id}
            href={mode.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {mode.label}
          </Link>
        );
      })}
    </nav>
  );
}
