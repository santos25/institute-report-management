import { cn } from "@/lib/utils";

const eyebrowTone = {
  azul: "text-azul-600",
  coral: "text-coral-700",
  lila: "text-lila-700",
} as const;

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "azul",
  align = "center",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: keyof typeof eyebrowTone;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p
        className={cn(
          "font-display text-sm font-semibold uppercase tracking-[0.2em]",
          eyebrowTone[tone]
        )}
      >
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance font-display text-4xl font-semibold leading-tight text-tinta sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-tinta-600">
          {description}
        </p>
      )}
    </div>
  );
}
