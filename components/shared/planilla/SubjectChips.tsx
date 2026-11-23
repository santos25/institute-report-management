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
    row.scrollBy({ left: delta });
  }, [activeId]);

  return (
    <div className="sticky top-16 z-30 border-y border-border bg-card/95 backdrop-blur-md sm:top-[4.25rem]">
      <div className="px-6 pt-3">
        <Label id="subject-chips-label" className="whitespace-nowrap text-sm font-bold">
          {label}
        </Label>
      </div>
      <div
        role="group"
        aria-labelledby="subject-chips-label"
        ref={rowRef}
        className="flex gap-2 overflow-x-auto overscroll-x-contain px-6 py-3"
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
                "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-60",
                item.active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:bg-accent"
              )}
            >
              <span className="whitespace-nowrap">{item.name}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                  item.active
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground dark:bg-tinta-700 dark:text-crema-100"
                )}
              >
                {item.progressText}
                {item.complete ? (
                  <Check
                    className={cn(
                      "size-3.5",
                      item.active
                        ? "text-primary-foreground"
                        : "text-hoja-700 dark:text-hoja-300"
                    )}
                    strokeWidth={3}
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
