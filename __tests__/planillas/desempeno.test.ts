import { describe, it, expect } from "vitest";
import { calculateDesempeno } from "@/components/planillas/desempeno-cell";

describe("calculateDesempeno", () => {
  describe("Superior (4.6-5.0)", () => {
    it("returns Superior for 4.6", () => {
      const result = calculateDesempeno("4.6");
      expect(result).toEqual({
        label: "Superior",
        colorClass: "bg-[#E8F7EE] text-[#146C36]",
      });
    });

    it("returns Superior for 5.0", () => {
      const result = calculateDesempeno("5.0");
      expect(result).toEqual({
        label: "Superior",
        colorClass: "bg-[#E8F7EE] text-[#146C36]",
      });
    });

    it("returns Superior for 4.8", () => {
      const result = calculateDesempeno("4.8");
      expect(result).toEqual({
        label: "Superior",
        colorClass: "bg-[#E8F7EE] text-[#146C36]",
      });
    });
  });

  describe("Alto (4.0-4.5)", () => {
    it("returns Alto for 4.0", () => {
      const result = calculateDesempeno("4.0");
      expect(result).toEqual({
        label: "Alto",
        colorClass: "bg-[#EAF2FF] text-[#1D5FD1]",
      });
    });

    it("returns Alto for 4.5", () => {
      const result = calculateDesempeno("4.5");
      expect(result).toEqual({
        label: "Alto",
        colorClass: "bg-[#EAF2FF] text-[#1D5FD1]",
      });
    });

    it("returns Alto for 4.3", () => {
      const result = calculateDesempeno("4.3");
      expect(result).toEqual({
        label: "Alto",
        colorClass: "bg-[#EAF2FF] text-[#1D5FD1]",
      });
    });
  });

  describe("Basico (3.0-3.9)", () => {
    it("returns Basico for 3.0", () => {
      const result = calculateDesempeno("3.0");
      expect(result).toEqual({
        label: "Básico",
        colorClass: "bg-[#FFF6E5] text-[#B45309]",
      });
    });

    it("returns Basico for 3.9", () => {
      const result = calculateDesempeno("3.9");
      expect(result).toEqual({
        label: "Básico",
        colorClass: "bg-[#FFF6E5] text-[#B45309]",
      });
    });

    it("returns Basico for 3.5", () => {
      const result = calculateDesempeno("3.5");
      expect(result).toEqual({
        label: "Básico",
        colorClass: "bg-[#FFF6E5] text-[#B45309]",
      });
    });
  });

  describe("Bajo (1.0-2.9)", () => {
    it("returns Bajo for 1.0", () => {
      const result = calculateDesempeno("1.0");
      expect(result).toEqual({
        label: "Bajo",
        colorClass: "bg-[#FDECEC] text-[#A51818]",
      });
    });

    it("returns Bajo for 2.9", () => {
      const result = calculateDesempeno("2.9");
      expect(result).toEqual({
        label: "Bajo",
        colorClass: "bg-[#FDECEC] text-[#A51818]",
      });
    });

    it("returns Bajo for 2.5", () => {
      const result = calculateDesempeno("2.5");
      expect(result).toEqual({
        label: "Bajo",
        colorClass: "bg-[#FDECEC] text-[#A51818]",
      });
    });
  });

  describe("Comma normalization", () => {
    it("accepts comma as decimal separator", () => {
      const result = calculateDesempeno("4,6");
      expect(result).toEqual({
        label: "Superior",
        colorClass: "bg-[#E8F7EE] text-[#146C36]",
      });
    });

    it("normalizes comma in middle range", () => {
      const result = calculateDesempeno("3,5");
      expect(result).toEqual({
        label: "Básico",
        colorClass: "bg-[#FFF6E5] text-[#B45309]",
      });
    });
  });

  describe("Boundary cases", () => {
    it("4.59 is Alto, not Superior", () => {
      const result = calculateDesempeno("4.59");
      expect(result).toEqual({
        label: "Alto",
        colorClass: "bg-[#EAF2FF] text-[#1D5FD1]",
      });
    });

    it("3.99 is Basico, not Alto", () => {
      const result = calculateDesempeno("3.99");
      expect(result).toEqual({
        label: "Básico",
        colorClass: "bg-[#FFF6E5] text-[#B45309]",
      });
    });

    it("2.99 is Bajo, not Basico", () => {
      const result = calculateDesempeno("2.99");
      expect(result).toEqual({
        label: "Bajo",
        colorClass: "bg-[#FDECEC] text-[#A51818]",
      });
    });
  });

  describe("Invalid inputs", () => {
    it("returns null for empty string", () => {
      expect(calculateDesempeno("")).toBeNull();
    });

    it("returns null for whitespace", () => {
      expect(calculateDesempeno("   ")).toBeNull();
    });

    it("returns null for non-numeric", () => {
      expect(calculateDesempeno("abc")).toBeNull();
    });

    it("returns null for below range (0.9)", () => {
      expect(calculateDesempeno("0.9")).toBeNull();
    });

    it("returns null for above range (5.1)", () => {
      expect(calculateDesempeno("5.1")).toBeNull();
    });

    it("returns null for negative", () => {
      expect(calculateDesempeno("-1.0")).toBeNull();
    });
  });

  describe("Edge formatting", () => {
    it("handles leading/trailing spaces", () => {
      const result = calculateDesempeno("  4.6  ");
      expect(result).toEqual({
        label: "Superior",
        colorClass: "bg-[#E8F7EE] text-[#146C36]",
      });
    });

    it("handles integer input", () => {
      const result = calculateDesempeno("5");
      expect(result).toEqual({
        label: "Superior",
        colorClass: "bg-[#E8F7EE] text-[#146C36]",
      });
    });
  });
});
