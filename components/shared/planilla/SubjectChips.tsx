"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type SubjectChipItem = {
  id: string;
  name: string;
  progressText: string;
  complete: boolean;
  active: boolean;
  filled: number | null;
  total: number;
};

type SubjectChipsProps = {
  label: string;
  items: SubjectChipItem[];
  disabled?: boolean;
  onSelect: (subjectId: string) => void;
};

export default function SubjectChips({
  label,
  items,
  disabled = false,
  onSelect,
}: SubjectChipsProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const activeId = items.find((item) => item.active)?.id ?? "";

  useEffect(() => {
    const row = rowRef.current;
    if (!row || !activeId) return;
    const active = row.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (!active) return;

    const rowRect = row.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const fullyVisible =
      activeRect.left >= rowRect.left - 1 && activeRect.right <= rowRect.right + 1;
    if (fullyVisible) return;

    const delta =
      activeRect.left - rowRect.left - (rowRect.width - activeRect.width) / 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: delta, behavior: reduceMotion ? "auto" : "smooth" });
  }, [activeId]);

  return (
    <div className="sticky top-16 z-30 bg-card/95 backdrop-blur-md sm:top-[4.25rem]">
      <div className="px-4 pt-1 sm:px-6">
        <Label
          id="subject-chips-label"
          className="text-xs font-semibold tracking-wide text-tinta-500"
        >
          {label}
        </Label>
      </div>
      <div
        role="group"
        aria-labelledby="subject-chips-label"
        ref={rowRef}
        className="flex overflow-x-auto overscroll-x-contain scroll-smooth border-b border-border [scrollbar-width:thin]"
      >
        {items.map((item) => {
          const progressDescription =
            item.filled == null
              ? item.progressText
              : `${item.filled} de ${item.total}${item.complete ? ", completa" : ""}`;

          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.active}
              aria-label={`${item.name}, ${progressDescription}`}
              disabled={disabled}
              onClick={() => onSelect(item.id)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-2 -mb-px border-b-2 px-4 py-2.5 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-60",
                item.active
                  ? "border-azul-500 font-bold text-tinta dark:text-crema"
                  : "border-transparent font-medium text-tinta-600 hover:bg-azul-50 hover:text-tinta dark:text-crema-200 dark:hover:bg-azul-900/40 dark:hover:text-crema"
              )}
            >
              <span className="whitespace-nowrap">{item.name}</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium tabular-nums text-tinta-500 dark:text-tinta-300">
                {item.progressText}
                {item.complete ? (
                  <Check
                    className="size-3.5 text-hoja-600 dark:text-hoja-300"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
