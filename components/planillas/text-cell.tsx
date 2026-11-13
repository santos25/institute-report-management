"use client";

import { useEffect, useRef } from "react";
import { Maximize2 } from "lucide-react";

interface TextCellProps {
  studentName: string;
  field: "logros" | "observacion";
  value: string;
  placeholder: string;
  isActive: boolean;
  onChange: (value: string) => void;
  onCommit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
}

export function TextCell({
  studentName,
  field,
  value,
  placeholder,
  isActive,
  onChange,
  onCommit,
  onKeyDown,
  onFocus,
}: TextCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const fieldLabel = field === "logros" ? "Logros" : "Observación general";

  return (
    <div
      className={`h-11 rounded-lg border px-2.5 flex items-center gap-2 text-sm w-full min-w-[200px] ${
        isActive ? "border-2 border-[#5B47E0] ring-4 ring-[#5B47E0]/25" : "border-[#E3E5EE] bg-white"
      }`}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder={placeholder}
        aria-label={`${fieldLabel} de ${studentName}`}
        className="flex-1 bg-transparent outline-none text-[#1F2433] placeholder:text-[#596074]/70 placeholder:italic"
      />
      <button
        aria-label="Ampliar"
        className="text-[#596074] shrink-0"
        tabIndex={-1}
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
