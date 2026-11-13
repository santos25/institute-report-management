import { z } from "zod";

/**
 * Normalize grade input by replacing comma with dot
 * Supports both European (4,5) and US (4.5) decimal separators
 */
export function normalizeGradeInput(value: string): string {
  return value.replace(",", ".");
}

export const gradeSchema = z
  .number()
  .min(1.0, {
    message: "La nota mínima es 1.0",
  })
  .max(5.0, {
    message: "La nota máxima es 5.0",
  })
  .refine(
    (val) => {
      // Ensure the number has at most one decimal place
      const decimalPlaces = (val.toString().split(".")[1] || "").length;
      return decimalPlaces <= 1;
    },
    {
      message: "La nota debe tener máximo un decimal",
    }
  );

export type GradeValue = z.infer<typeof gradeSchema>;

export const gradeInputSchema = z.object({
  studentId: z.string().min(1, "ID de estudiante requerido"),
  subjectId: z.string().min(1, "ID de materia requerido"),
  periodId: z.string().min(1, "ID de período requerido"),
  value: gradeSchema,
  achievements: z.string().optional(),
  observation: z.string().optional(),
});

export type GradeInput = z.infer<typeof gradeInputSchema>;
