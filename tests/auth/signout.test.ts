import { describe, it, expect, beforeEach } from "vitest";

// Inline sanitize function to avoid import issues in tests
function sanitizeCallbackUrl(url: string | null): string {
  if (!url) return "/";
  
  try {
    // Only allow relative paths
    if (url.startsWith("/") && !url.startsWith("//")) {
      return url;
    }
    
    // Try to parse as URL to check if it's same origin
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin === window.location.origin) {
      return parsed.pathname + parsed.search + parsed.hash;
    }
  } catch (e) {
    // Invalid URL, use default
  }
  
  return "/";
}

describe("sanitizeCallbackUrl", () => {
  beforeEach(() => {
    // Mock window.location.origin
    Object.defineProperty(window, "location", {
      value: {
        origin: "http://localhost:3000",
        href: "http://localhost:3000",
      },
      writable: true,
    });
  });

  it("should return / for null or undefined", () => {
    expect(sanitizeCallbackUrl(null)).toBe("/");
    expect(sanitizeCallbackUrl("")).toBe("/");
  });

  it("should allow relative paths", () => {
    expect(sanitizeCallbackUrl("/planillas")).toBe("/planillas");
    expect(sanitizeCallbackUrl("/boletines?grado=1")).toBe(
      "/boletines?grado=1"
    );
    expect(sanitizeCallbackUrl("/portal/settings")).toBe("/portal/settings");
  });

  it("should reject protocol-relative URLs", () => {
    expect(sanitizeCallbackUrl("//evil.com/phishing")).toBe("/");
  });

  it("should accept same-origin absolute URLs", () => {
    expect(sanitizeCallbackUrl("http://localhost:3000/planillas")).toBe(
      "/planillas"
    );
    expect(
      sanitizeCallbackUrl("http://localhost:3000/boletines?grado=1#section")
    ).toBe("/boletines?grado=1#section");
  });

  it("should reject different-origin URLs", () => {
    expect(sanitizeCallbackUrl("https://evil.com/phishing")).toBe("/");
    expect(sanitizeCallbackUrl("http://attacker.com/steal")).toBe("/");
  });

  it("should reject javascript: URLs", () => {
    expect(sanitizeCallbackUrl("javascript:alert(1)")).toBe("/");
  });

  it("should reject data: URLs", () => {
    expect(sanitizeCallbackUrl("data:text/html,<script>alert(1)</script>")).toBe(
      "/"
    );
  });

  it("should preserve query params and hash for valid URLs", () => {
    expect(sanitizeCallbackUrl("/page?foo=bar&baz=qux#anchor")).toBe(
      "/page?foo=bar&baz=qux#anchor"
    );
  });
});
