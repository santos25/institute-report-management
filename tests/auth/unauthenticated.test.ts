import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireAuth, requireRole } from "@/lib/auth-helpers";
import type { Session } from "next-auth";

// Mock the auth module
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Import after mocking
const { auth } = await import("@/auth");

describe("requireAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return UNAUTHENTICATED when no session exists", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await requireAuth();

    expect(result).toEqual({
      ok: false,
      code: "UNAUTHENTICATED",
      message: "No session found",
    });
  });

  it("should return UNAUTHENTICATED when session has no user", async () => {
    vi.mocked(auth).mockResolvedValue({ user: undefined, expires: "2024-12-31" } as Session);

    const result = await requireAuth();

    expect(result).toEqual({
      ok: false,
      code: "UNAUTHENTICATED",
      message: "No session found",
    });
  });

  it("should return session when authenticated", async () => {
    const mockSession: Session = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        role: "TEACHER",
        degreeIds: ["degree-1"],
      },
      expires: "2024-12-31",
    };

    vi.mocked(auth).mockResolvedValue(mockSession);

    const result = await requireAuth();

    expect(result).toEqual({
      ok: true,
      data: mockSession,
    });
  });
});

describe("requireRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return UNAUTHENTICATED when no session exists", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await requireRole(["ADMIN"]);

    expect(result).toEqual({
      ok: false,
      code: "UNAUTHENTICATED",
      message: "No session found",
    });
  });

  it("should return FORBIDDEN when role is not allowed", async () => {
    const mockSession: Session = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        role: "TEACHER",
        degreeIds: ["degree-1"],
      },
      expires: "2024-12-31",
    };

    vi.mocked(auth).mockResolvedValue(mockSession);

    const result = await requireRole(["ADMIN"]);

    expect(result).toEqual({
      ok: false,
      code: "FORBIDDEN",
      message: "Insufficient permissions",
    });
  });

  it("should return session when role is allowed", async () => {
    const mockSession: Session = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        role: "ADMIN",
        degreeIds: [],
      },
      expires: "2024-12-31",
    };

    vi.mocked(auth).mockResolvedValue(mockSession);

    const result = await requireRole(["ADMIN"]);

    expect(result).toEqual({
      ok: true,
      data: mockSession,
    });
  });

  it("should accept multiple allowed roles", async () => {
    const mockSession: Session = {
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        role: "TEACHER",
        degreeIds: ["degree-1"],
      },
      expires: "2024-12-31",
    };

    vi.mocked(auth).mockResolvedValue(mockSession);

    const result = await requireRole(["ADMIN", "TEACHER"]);

    expect(result).toEqual({
      ok: true,
      data: mockSession,
    });
  });
});
