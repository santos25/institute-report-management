"use client";

import { useEffect, useRef } from "react";

interface GradeCellProps {
  studentId: string;
  studentName: string;
  value: string;
  status: "idle" | "editing" | "saving" | "saved" | "error" | "invalid";
  error?: string;
  isActive: boolean;
  onChange: (value: string) => void;
  onCommit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
}

export function GradeCell({
  studentId,
  studentName,
  value,
  status,
  error,
  isActive,
  onChange,
  onCommit,
  onKeyDown,
  onFocus,
}: GradeCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const getBorderClass = () => {
    if (status === "invalid" || status === "error") {
      return "border-2 border-[#C81E1E] bg-[#FDECEC]";
    }
    if (status === "saved") {
      return "border border-[#15803D]/50 bg-white";
    }
    if (isActive) {
      return "border-2 border-[#5B47E0] ring-4 ring-[#5B47E0]/25";
    }
    if (!value.trim()) {
      return "border border-dashed border-[#B45309]/50 bg-[#FFF6E5]/50";
    }
    return "border border-[#E3E5EE] bg-white";
  };

  const getTextClass = () => {
    if (status === "invalid" || status === "error") {
      return "text-[#A51818]";
    }
    return "text-[#1F2433]";
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder="–"
        aria-label={`Nota de ${studentName}`}
        aria-invalid={status === "invalid" || status === "error"}
        aria-describedby={error ? `err-${studentId}` : undefined}
        className={`w-[76px] h-11 rounded-lg text-center text-lg font-semibold tabular-nums outline-none ${getBorderClass()} ${getTextClass()} placeholder:text-[#B45309]`}
      />
      {error && (status === "invalid" || status === "error") && (
        <div
          id={`err-${studentId}`}
          role="alert"
          className="absolute left-0 top-[48px] z-20 w-[208px] rounded-lg bg-[#A51818] text-white text-xs px-2.5 py-2 shadow-lg leading-snug"
        >
          <span className="absolute -top-1 left-7 w-2 h-2 bg-[#A51818] rotate-45"></span>
          <b>Nota no válida.</b> {error}
        </div>
      )}
    </div>
  );
}
