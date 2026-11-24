"use client";

import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SubjectNavItem = {
  id: string;
  name: string;
  progressText: string;
  complete: boolean;
  active: boolean;
  filled: number | null;
  total: number;
  keepCount?: boolean;
  description?: string;
};

type SubjectNavProps = {
  label: string;
  items: SubjectNavItem[];
  footerLabel?: string;
  footerItems?: SubjectNavItem[];
  disabled?: boolean;
  onSelect: (subjectId: string) => void;
};

function progressDescription(item: SubjectNavItem): string {
  if (item.filled == null) return item.progressText;
  return `${item.filled} de ${item.total}${item.complete ? ", completa" : ""}`;
}

function ProgressMark({ item }: { item: SubjectNavItem }) {
  if (item.complete && !item.keepCount) {
    return (
      <span className="inline-flex shrink-0 items-center">
        <Check
          className="size-4 text-hoja-700 dark:text-hoja-300"
          strokeWidth={3}
          aria-hidden
        />
        <span className="sr-only">completa</span>
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums text-muted-foreground">
      {item.complete ? (
        <Check
          className="size-4 text-hoja-700"
          strokeWidth={3}
          aria-hidden
        />
      ) : null}
      {item.progressText}
    </span>
  );
}

function itemLabel(item: SubjectNavItem): string {
  return item.description ?? `${item.name}, ${progressDescription(item)}`;
}

function NavButton({
  item,
  disabled,
  onSelect,
}: {
  item: SubjectNavItem;
  disabled: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      aria-current={item.active ? "page" : undefined}
      aria-label={itemLabel(item)}
      disabled={disabled}
      onClick={() => onSelect(item.id)}
      className={cn(
        "flex w-full items-center gap-2 border-l-[3px] py-2.5 pr-3 pl-2.5 text-left text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        "disabled:cursor-not-allowed disabled:opacity-60",
        item.active
          ? "border-azul-500 bg-azul-50 font-semibold text-tinta dark:bg-azul-900/70 dark:text-crema"
          : "border-transparent text-foreground hover:bg-muted/80"
      )}
    >
      <span className="min-w-0 flex-1 leading-snug">{item.name}</span>
      <ProgressMark item={item} />
    </button>
  );
}

function SelectOptions({ items }: { items: SubjectNavItem[] }) {
  return items.map((item) => (
    <SelectItem key={item.id} value={item.id}>
      <span className="flex w-full items-center justify-between gap-3 pr-6">
        <span className="truncate">{item.name}</span>
        <ProgressMark item={item} />
      </span>
    </SelectItem>
  ));
}

export default function SubjectNav({
  label,
  items,
  footerLabel,
  footerItems = [],
  disabled = false,
  onSelect,
}: SubjectNavProps) {
  const activeItem =
    [...items, ...footerItems].find((item) => item.active) ?? null;
  const activeId = activeItem?.id ?? "";
  const mobileLabel =
    footerLabel && footerItems.some((item) => item.active) ? footerLabel : label;

  return (
    <div className="min-w-0 lg:border-r lg:border-border">
      <div className="px-4 py-3 sm:px-6 lg:hidden">
        <Label htmlFor="subject-nav-select" className="mb-2 text-sm font-bold">
          {mobileLabel}
        </Label>
        <Select
          value={activeId || undefined}
          onValueChange={onSelect}
          disabled={disabled || (items.length === 0 && footerItems.length === 0)}
        >
          <SelectTrigger
            id="subject-nav-select"
            className="h-11 w-full bg-card *:data-[slot=select-value]:min-w-0 *:data-[slot=select-value]:flex-1"
          >
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              <SelectOptions items={items} />
            </SelectGroup>
            {footerItems.length > 0 ? (
              <SelectGroup>
                <SelectLabel>{footerLabel}</SelectLabel>
                <SelectOptions items={footerItems} />
              </SelectGroup>
            ) : null}
          </SelectContent>
        </Select>
      </div>

      <nav
        aria-labelledby="subject-nav-label"
        className="sticky top-[4.75rem] z-30 hidden max-h-[calc(100dvh-4.75rem-5.5rem)] overflow-y-auto overscroll-y-contain py-2 lg:block"
      >
        <p id="subject-nav-label" className="px-3 pb-2 pt-1 text-sm font-bold">
          {label}
        </p>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <NavButton item={item} disabled={disabled} onSelect={onSelect} />
            </li>
          ))}
        </ul>
        {footerItems.length > 0 ? (
          <div className="mt-2 border-t border-border pt-2">
            <p className="px-3 pb-2 pt-1 text-sm font-bold">{footerLabel}</p>
            <ul>
              {footerItems.map((item) => (
                <li key={item.id}>
                  <NavButton item={item} disabled={disabled} onSelect={onSelect} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </div>
  );
}
