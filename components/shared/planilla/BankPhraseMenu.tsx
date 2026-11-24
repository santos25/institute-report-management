"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import {
  isPerformance,
  PERFORMANCE_LABELS,
  performanceClass,
  type Performance,
  type PlanillaAchievement,
  type PlanillaObservation,
} from "@/lib/bank";

const PANEL_WIDTH = 340;
const PANEL_HEIGHT = 288;

export function BankPhraseMenu({
  label,
  ariaLabel,
  icon,
  children,
}: {
  label: string;
  ariaLabel: string;
  icon: ReactNode;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const panelId = useId();

  useLayoutEffect(() => {
    if (!open) return;

    const place = () => {
      const button = buttonRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const roomOnRight = window.innerWidth - rect.left;
      const left =
        roomOnRight >= PANEL_WIDTH + 12
          ? rect.left
          : Math.max(12, Math.min(rect.right - PANEL_WIDTH, window.innerWidth - PANEL_WIDTH - 12));
      const below = rect.bottom + 8;
      const fitsBelow = below + PANEL_HEIGHT < window.innerHeight - 12;
      const top = fitsBelow
        ? below
        : Math.max(12, rect.top - PANEL_HEIGHT - 8);
      setPosition({ top, left });
    };

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-xs font-medium text-tinta-600 hover:border-azul-200 hover:bg-azul-50 hover:text-azul-700"
      >
        {icon}
        {label}
      </button>
      {open && position
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-label={ariaLabel}
              style={{ top: position.top, left: position.left, width: PANEL_WIDTH }}
              className="fixed z-50 flex max-h-72 flex-col overflow-hidden rounded-xl border border-border bg-card text-tinta shadow-lg"
            >
              {children(() => setOpen(false))}
            </div>,
            document.body
          )
        : null}
    </>
  );
}

function PhraseButton({
  onSelect,
  content,
  meta,
}: {
  onSelect: () => void;
  content: string;
  meta?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full flex-col items-start gap-1 rounded-lg px-2 py-2 text-left hover:bg-azul-50"
    >
      {meta}
      <span className="text-sm leading-snug text-tinta">{content}</span>
    </button>
  );
}

export function AchievementPhraseList({
  phrases,
  performance,
  status,
  onSelect,
}: {
  phrases: PlanillaAchievement[];
  performance: string;
  status: "loading" | "ready" | "error";
  onSelect: (content: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const canFilter = isPerformance(performance);
  const visible =
    canFilter && !showAll
      ? phrases.filter((phrase) => phrase.performance === performance)
      : phrases;

  return (
    <>
      <div className="border-b border-border px-3 py-2">
        <p className="text-xs font-semibold text-tinta">
          {canFilter && !showAll
            ? `Desempeño ${performance} · ${PERFORMANCE_LABELS[performance as Performance]}`
            : "Logros de esta materia"}
        </p>
        {canFilter ? (
          <button
            type="button"
            className="mt-1 text-xs font-medium text-azul-700 underline-offset-2 hover:underline"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll
              ? `Solo desempeño ${performance}`
              : "Ver todos los de la materia"}
          </button>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Escribe la nota para priorizar por desempeño.
          </p>
        )}
      </div>
      <div className="overflow-y-auto p-1">
        {status === "loading" ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">Cargando frases…</p>
        ) : null}
        {status === "error" ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            No se pudo cargar el banco.
          </p>
        ) : null}
        {status === "ready" && visible.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            {canFilter && !showAll
              ? "No hay logros de este desempeño. Puedes ver todos los de la materia."
              : "Esta materia todavía no tiene logros en el banco."}
          </p>
        ) : null}
        {status === "ready"
          ? visible.map((phrase) => (
              <PhraseButton
                key={phrase.id}
                content={phrase.content}
                onSelect={() => onSelect(phrase.content)}
                meta={
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium",
                      performanceClass(phrase.performance)
                    )}
                  >
                    {phrase.performance} · {PERFORMANCE_LABELS[phrase.performance]}
                  </span>
                }
              />
            ))
          : null}
      </div>
    </>
  );
}

export function ObservationPhraseList({
  phrases,
  status,
  onSelect,
}: {
  phrases: PlanillaObservation[];
  status: "loading" | "ready" | "error";
  onSelect: (content: string) => void;
}) {
  return (
    <>
      <div className="border-b border-border px-3 py-2">
        <p className="text-xs font-semibold text-tinta">Observaciones del banco</p>
      </div>
      <div className="overflow-y-auto p-1">
        {status === "loading" ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">Cargando frases…</p>
        ) : null}
        {status === "error" ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            No se pudo cargar el banco.
          </p>
        ) : null}
        {status === "ready" && phrases.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            Todavía no hay observaciones en el banco.
          </p>
        ) : null}
        {status === "ready"
          ? phrases.map((phrase) => (
              <PhraseButton
                key={phrase.id}
                content={phrase.content}
                onSelect={() => onSelect(phrase.content)}
                meta={
                  phrase.category ? (
                    <span className="rounded-full bg-coral-100 px-2 py-0.5 text-[11px] font-medium text-tinta">
                      {phrase.category}
                    </span>
                  ) : undefined
                }
              />
            ))
          : null}
      </div>
    </>
  );
}
