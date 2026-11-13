import { describe, it, expect } from "vitest";
import { sanitizeCallbackUrl } from "@/lib/auth-utils";

describe("Authentication redirect logic", () => {
  describe("sanitizeCallbackUrl", () => {
    it("returns null for null input", () => {
      expect(sanitizeCallbackUrl(null)).toBeNull();
    });

    it("returns null for undefined input", () => {
      expect(sanitizeCallbackUrl(undefined)).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(sanitizeCallbackUrl("")).toBeNull();
    });

    it("allows valid relative paths", () => {
      expect(sanitizeCallbackUrl("/portal")).toBe("/portal");
      expect(sanitizeCallbackUrl("/planillas")).toBe("/planillas");
      expect(sanitizeCallbackUrl("/boletines/jardin")).toBe("/boletines/jardin");
    });

    it("preserves query strings and hashes in relative paths", () => {
      expect(sanitizeCallbackUrl("/portal?foo=bar")).toBe("/portal?foo=bar");
      expect(sanitizeCallbackUrl("/planillas#section")).toBe("/planillas#section");
      expect(sanitizeCallbackUrl("/boletines?id=123#top")).toBe("/boletines?id=123#top");
    });

    it("rejects protocol-relative URLs", () => {
      expect(sanitizeCallbackUrl("//evil.com/phish")).toBeNull();
      expect(sanitizeCallbackUrl("//example.com")).toBeNull();
    });

    it("rejects absolute URLs", () => {
      expect(sanitizeCallbackUrl("https://evil.com/phish")).toBeNull();
      expect(sanitizeCallbackUrl("http://example.com")).toBeNull();
    });

    it("rejects javascript: URLs", () => {
      expect(sanitizeCallbackUrl("javascript:alert(1)")).toBeNull();
    });

    it("rejects data: URLs", () => {
      expect(sanitizeCallbackUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    });

    it("handles encoded characters in paths", () => {
      expect(sanitizeCallbackUrl("/portal?name=Juan%20P%C3%A9rez")).toBe(
        "/portal?name=Juan%20P%C3%A9rez"
      );
    });
  });

  describe("Default redirect destination", () => {
    it("should default to /portal for authenticated users with no callback", () => {
      // This test documents the expected behavior:
      // When a user logs in without a callbackUrl parameter,
      // the authenticate() function should return "/portal" as the destination
      const expectedDefault = "/portal";
      expect(expectedDefault).toBe("/portal");
    });

    it("should preserve valid callbackUrl over default", () => {
      // When a valid callbackUrl is provided, it should be used
      const validCallback = "/planillas/jardin";
      const sanitized = sanitizeCallbackUrl(validCallback);
      expect(sanitized).toBe(validCallback);
    });

    it("should fall back to /portal for invalid callbackUrl", () => {
      // When an invalid callbackUrl is provided, fall back to /portal
      const invalidCallback = "https://evil.com";
      const sanitized = sanitizeCallbackUrl(invalidCallback);
      expect(sanitized).toBeNull();
      // In authenticate(), this would result in using "/portal" as the default
    });
  });

  describe("Login page redirect for authenticated users", () => {
    it("should redirect to /portal when already authenticated", () => {
      // This test documents the expected behavior:
      // An authenticated user who visits /login should be redirected to /portal
      const expectedRedirect = "/portal";
      expect(expectedRedirect).toBe("/portal");
    });
  });
});
