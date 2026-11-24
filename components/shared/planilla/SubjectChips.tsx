"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
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

function progressDescription(item: SubjectChipItem): string {
  if (item.filled == null) {
    return item.progressText;
  }
  return `${item.filled} de ${item.total}${item.complete ? ", completa" : ""}`;
}

function SubjectProgress({
  item,
  emphasizeName = false,
}: {
  item: SubjectChipItem;
  emphasizeName?: boolean;
}) {
  return (
    <>
      <span className={cn("min-w-0 truncate", emphasizeName && "font-semibold")}>
        {item.name}
      </span>
      <span className="shrink-0 font-normal text-muted-foreground">·</span>
      <span className="shrink-0 font-semibold tabular-nums text-muted-foreground">
        {item.progressText}
      </span>
      {item.complete ? (
        <>
          <Check
            className="size-3.5 shrink-0 text-hoja-600 dark:text-hoja-300"
            strokeWidth={3}
            aria-hidden
          />
          <span className="sr-only">completa</span>
        </>
      ) : null}
    </>
  );
}

export default function SubjectChips({
  label,
  items,
  disabled = false,
  onSelect,
}: SubjectChipsProps) {
  const activeIndex = items.findIndex((item) => item.active);
  const active = activeIndex >= 0 ? items[activeIndex] : undefined;
  const previous = activeIndex > 0 ? items[activeIndex - 1] : undefined;
  const next =
    activeIndex >= 0 && activeIndex < items.length - 1
      ? items[activeIndex + 1]
      : undefined;

  const selectSubject = (subjectId: string) => {
    if (!subjectId || subjectId === active?.id || disabled) return;
    onSelect(subjectId);
  };

  return (
    <div className="sticky top-16 z-30 border-y border-border/80 bg-card/95 backdrop-blur-md sm:top-[4.25rem]">
      <div
        role="group"
        aria-labelledby="subject-switcher-label"
        className="mx-auto flex w-full max-w-xl items-center gap-1 px-3 py-2 sm:gap-1.5 sm:px-4"
      >
        <Label id="subject-switcher-label" className="sr-only">
          {label}
        </Label>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 text-muted-foreground"
          disabled={disabled || !previous}
          aria-label={
            previous ? `Materia anterior: ${previous.name}` : "Materia anterior"
          }
          onClick={() => {
            if (previous) selectSubject(previous.id);
          }}
        >
          <ChevronLeft />
        </Button>

        <Select
          value={active?.id ?? ""}
          onValueChange={selectSubject}
          disabled={disabled || items.length === 0}
        >
          <SelectTrigger
            id="subject-switcher"
            aria-label={
              active
                ? `${label}: ${active.name}, ${progressDescription(active)}`
                : label
            }
            className="h-9 min-w-0 flex-1 overflow-hidden border-border/80 bg-background px-3 shadow-none"
          >
            {active ? (
              <span className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
                <SubjectProgress item={active} emphasizeName />
              </span>
            ) : (
              <span className="truncate text-muted-foreground">
                Seleccionar materia
              </span>
            )}
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="start"
            className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]"
          >
            {items.map((item) => (
              <SelectItem
                key={item.id}
                value={item.id}
                aria-label={`${item.name}, ${progressDescription(item)}`}
                className="py-2 pr-8 [&>span:last-child]:flex [&>span:last-child]:w-full [&>span:last-child]:min-w-0"
              >
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
                <span className="ml-3 flex shrink-0 items-center gap-1 font-semibold tabular-nums text-muted-foreground">
                  {item.progressText}
                  {item.complete ? (
                    <>
                      <Check
                        className="size-3.5 text-hoja-600 dark:text-hoja-300"
                        strokeWidth={3}
                        aria-hidden
                      />
                      <span className="sr-only">completa</span>
                    </>
                  ) : null}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 text-muted-foreground"
          disabled={disabled || !next}
          aria-label={
            next ? `Materia siguiente: ${next.name}` : "Materia siguiente"
          }
          onClick={() => {
            if (next) selectSubject(next.id);
          }}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
