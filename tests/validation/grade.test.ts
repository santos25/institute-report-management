import { describe, it, expect } from "vitest";
import { gradeSchema, normalizeGradeInput } from "@/lib/validation/grade.schema";

describe("Grade Validation", () => {
  describe("Comma decimal separator normalization", () => {
    it("should normalize '4,5' to '4.5'", () => {
      const normalized = normalizeGradeInput("4,5");
      expect(normalized).toBe("4.5");
      const result = gradeSchema.safeParse(parseFloat(normalized));
      expect(result.success).toBe(true);
    });

    it("should reject '5,5' as it becomes 5.5 (>5.0)", () => {
      const normalized = normalizeGradeInput("5,5");
      expect(normalized).toBe("5.5");
      const result = gradeSchema.safeParse(parseFloat(normalized));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("5.0");
      }
    });

    it("should reject '3,55' as it has too many decimals", () => {
      const normalized = normalizeGradeInput("3,55");
      expect(normalized).toBe("3.55");
      const result = gradeSchema.safeParse(parseFloat(normalized));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("decimal");
      }
    });

    it("should handle '4.5' unchanged", () => {
      const normalized = normalizeGradeInput("4.5");
      expect(normalized).toBe("4.5");
      const result = gradeSchema.safeParse(parseFloat(normalized));
      expect(result.success).toBe(true);
    });

    it("should normalize '1,0' to '1.0' and accept", () => {
      const normalized = normalizeGradeInput("1,0");
      expect(normalized).toBe("1.0");
      const result = gradeSchema.safeParse(parseFloat(normalized));
      expect(result.success).toBe(true);
    });

    it("should normalize '5,0' to '5.0' and accept", () => {
      const normalized = normalizeGradeInput("5,0");
      expect(normalized).toBe("5.0");
      const result = gradeSchema.safeParse(parseFloat(normalized));
      expect(result.success).toBe(true);
    });
  });

  describe("Valid grades", () => {
    it("should accept grade 1.0", () => {
      const result = gradeSchema.safeParse(1.0);
      expect(result.success).toBe(true);
    });

    it("should accept grade 5.0", () => {
      const result = gradeSchema.safeParse(5.0);
      expect(result.success).toBe(true);
    });

    it("should accept grade 3.5", () => {
      const result = gradeSchema.safeParse(3.5);
      expect(result.success).toBe(true);
    });

    it("should accept grade 4.2", () => {
      const result = gradeSchema.safeParse(4.2);
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid grades - out of range", () => {
    it("should reject grade 0", () => {
      const result = gradeSchema.safeParse(0);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("1.0");
      }
    });

    it("should reject grade 0.9", () => {
      const result = gradeSchema.safeParse(0.9);
      expect(result.success).toBe(false);
    });

    it("should reject grade 5.1", () => {
      const result = gradeSchema.safeParse(5.1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("5.0");
      }
    });

    it("should reject grade 6.0", () => {
      const result = gradeSchema.safeParse(6.0);
      expect(result.success).toBe(false);
    });

    it("should reject negative grades", () => {
      const result = gradeSchema.safeParse(-1);
      expect(result.success).toBe(false);
    });
  });

  describe("Invalid grades - wrong type", () => {
    it("should reject string values", () => {
      const result = gradeSchema.safeParse("3.5");
      expect(result.success).toBe(false);
    });

    it("should reject null", () => {
      const result = gradeSchema.safeParse(null);
      expect(result.success).toBe(false);
    });

    it("should reject undefined", () => {
      const result = gradeSchema.safeParse(undefined);
      expect(result.success).toBe(false);
    });
  });

  describe("Invalid grades - too many decimals", () => {
    it("should reject grade 3.55", () => {
      const result = gradeSchema.safeParse(3.55);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("decimal");
      }
    });

    it("should reject grade 4.123", () => {
      const result = gradeSchema.safeParse(4.123);
      expect(result.success).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should accept integers without decimals", () => {
      const result = gradeSchema.safeParse(3);
      expect(result.success).toBe(true);
    });

    it("should accept grade 1.0 exactly", () => {
      const result = gradeSchema.safeParse(1.0);
      expect(result.success).toBe(true);
    });

    it("should accept grade 5.0 exactly", () => {
      const result = gradeSchema.safeParse(5.0);
      expect(result.success).toBe(true);
    });
  });
});
