"use client";

interface DesempenoCellProps {
  value: string;
}

export function calculateDesempeno(gradeValue: string): {
  label: string;
  colorClass: string;
} | null {
  if (!gradeValue.trim()) {
    return null;
  }

  // Normalize comma to dot
  const normalized = gradeValue.trim().replace(",", ".");
  const grade = parseFloat(normalized);

  if (isNaN(grade) || grade < 1.0 || grade > 5.0) {
    return null;
  }

  if (grade >= 4.6 && grade <= 5.0) {
    return {
      label: "Superior",
      colorClass: "bg-[#E8F7EE] text-[#146C36]",
    };
  } else if (grade >= 4.0 && grade < 4.6) {
    return {
      label: "Alto",
      colorClass: "bg-[#EAF2FF] text-[#1D5FD1]",
    };
  } else if (grade >= 3.0 && grade < 4.0) {
    return {
      label: "Basico",
      colorClass: "bg-[#FFF6E5] text-[#B45309]",
    };
  } else if (grade >= 1.0 && grade < 3.0) {
    return {
      label: "Bajo",
      colorClass: "bg-[#FDECEC] text-[#A51818]",
    };
  }

  return null;
}

export function DesempenoCell({ value }: DesempenoCellProps) {
  const desempeno = calculateDesempeno(value);

  if (!desempeno) {
    return <span className="text-xs text-[#596074]">-</span>;
  }

  return (
    <span
      className={`inline-flex items-center h-6 px-2 rounded-md text-xs font-semibold ${desempeno.colorClass}`}
    >
      {desempeno.label}
    </span>
  );
}