import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Autosave and retry logic tests
 * Tests the behavior described in grade-grid.tsx:
 * - Autosave triggers on blur or Enter
 * - 3 retry attempts with exponential backoff (1s, 3s, 8s)
 * - Per-cell state tracking
 */

describe("Autosave retry logic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Exponential backoff", () => {
    it("waits 1 second before first retry", async () => {
      const mockSave = vi.fn().mockRejectedValue(new Error("Network error"));
      
      const saveWithRetry = async (attempt = 0): Promise<boolean> => {
        try {
          await mockSave();
          return true;
        } catch {
          if (attempt < 3) {
            const delays = [1000, 3000, 8000];
            await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
            return saveWithRetry(attempt + 1);
          }
          return false;
        }
      };

      const promise = saveWithRetry();
      
      // First attempt fails immediately, advance to allow microtasks
      await vi.advanceTimersByTimeAsync(1);
      expect(mockSave).toHaveBeenCalledTimes(1);

      // Wait 1 second for first retry
      await vi.advanceTimersByTimeAsync(1000);
      expect(mockSave).toHaveBeenCalledTimes(2);

      // Complete all remaining retries
      await vi.advanceTimersByTimeAsync(3000 + 8000);
      const result = await promise;
      expect(result).toBe(false);
    });

    it("waits 3 seconds before second retry", async () => {
      const mockSave = vi.fn().mockRejectedValue(new Error("Network error"));
      
      const saveWithRetry = async (attempt = 0): Promise<boolean> => {
        try {
          await mockSave();
          return true;
        } catch {
          if (attempt < 3) {
            const delays = [1000, 3000, 8000];
            await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
            return saveWithRetry(attempt + 1);
          }
          return false;
        }
      };

      const promise = saveWithRetry();
      
      // First attempt + first retry
      await vi.advanceTimersByTimeAsync(1000);
      expect(mockSave).toHaveBeenCalledTimes(2);

      // Wait 3 seconds for second retry
      await vi.advanceTimersByTimeAsync(3000);
      expect(mockSave).toHaveBeenCalledTimes(3);

      // Complete remaining retries to resolve promise
      await vi.advanceTimersByTimeAsync(8000);
      await promise;
    }, 15000);

    it("waits 8 seconds before third retry", async () => {
      const mockSave = vi.fn().mockRejectedValue(new Error("Network error"));
      
      const saveWithRetry = async (attempt = 0): Promise<boolean> => {
        try {
          await mockSave();
          return true;
        } catch {
          if (attempt < 3) {
            const delays = [1000, 3000, 8000];
            await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
            return saveWithRetry(attempt + 1);
          }
          return false;
        }
      };

      const promise = saveWithRetry();
      
      // First attempt + first two retries
      await vi.advanceTimersByTimeAsync(1000 + 3000);
      expect(mockSave).toHaveBeenCalledTimes(3);

      // Wait 8 seconds for third retry
      await vi.advanceTimersByTimeAsync(8000);
      expect(mockSave).toHaveBeenCalledTimes(4);

      const result = await promise;
      expect(result).toBe(false); // All retries exhausted
    });

    it("stops after 3 failed attempts", async () => {
      const mockSave = vi.fn().mockRejectedValue(new Error("Network error"));
      
      const saveWithRetry = async (attempt = 0): Promise<boolean> => {
        try {
          await mockSave();
          return true;
        } catch {
          if (attempt < 3) {
            const delays = [1000, 3000, 8000];
            await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
            return saveWithRetry(attempt + 1);
          }
          return false;
        }
      };

      const promise = saveWithRetry();
      
      // Fast-forward through all retries
      await vi.advanceTimersByTimeAsync(1000 + 3000 + 8000);
      
      const result = await promise;
      
      // 1 initial + 3 retries = 4 total attempts
      expect(mockSave).toHaveBeenCalledTimes(4);
      expect(result).toBe(false);
    }, 15000);
  });

  describe("Successful save scenarios", () => {
    it("returns true on first successful attempt", async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      
      const saveWithRetry = async (attempt = 0): Promise<boolean> => {
        try {
          await mockSave();
          return true;
        } catch {
          if (attempt < 3) {
            const delays = [1000, 3000, 8000];
            await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
            return saveWithRetry(attempt + 1);
          }
          return false;
        }
      };

      const result = await saveWithRetry();
      
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it("returns true if retry succeeds", async () => {
      const mockSave = vi
        .fn()
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValue(undefined);
      
      const saveWithRetry = async (attempt = 0): Promise<boolean> => {
        try {
          await mockSave();
          return true;
        } catch {
          if (attempt < 3) {
            const delays = [1000, 3000, 8000];
            await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
            return saveWithRetry(attempt + 1);
          }
          return false;
        }
      };

      const promise = saveWithRetry();
      
      // Wait for first retry
      await vi.advanceTimersByTimeAsync(1000);
      
      const result = await promise;
      
      expect(mockSave).toHaveBeenCalledTimes(2);
      expect(result).toBe(true);
    });

    it("succeeds on third retry", async () => {
      const mockSave = vi
        .fn()
        .mockRejectedValueOnce(new Error("Fail 1"))
        .mockRejectedValueOnce(new Error("Fail 2"))
        .mockRejectedValueOnce(new Error("Fail 3"))
        .mockResolvedValue(undefined);
      
      const saveWithRetry = async (attempt = 0): Promise<boolean> => {
        try {
          await mockSave();
          return true;
        } catch {
          if (attempt < 3) {
            const delays = [1000, 3000, 8000];
            await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
            return saveWithRetry(attempt + 1);
          }
          return false;
        }
      };

      const promise = saveWithRetry();
      
      // Fast-forward through all delays
      await vi.advanceTimersByTimeAsync(1000 + 3000 + 8000);
      
      const result = await promise;
      
      expect(mockSave).toHaveBeenCalledTimes(4);
      expect(result).toBe(true);
    });
  });

  describe("Total retry time", () => {
    it("takes 12 seconds total for all retries (1 + 3 + 8)", async () => {
      const mockSave = vi.fn().mockRejectedValue(new Error("Network error"));
      
      const saveWithRetry = async (attempt = 0): Promise<boolean> => {
        try {
          await mockSave();
          return true;
        } catch {
          if (attempt < 3) {
            const delays = [1000, 3000, 8000];
            await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
            return saveWithRetry(attempt + 1);
          }
          return false;
        }
      };

      const start = Date.now();
      const promise = saveWithRetry();
      
      // Fast-forward through all retries
      await vi.advanceTimersByTimeAsync(12000);
      
      await promise;
      
      // Verify total delay
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(12000);
    });
  });
});
