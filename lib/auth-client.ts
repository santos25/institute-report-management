"use client";

/**
 * Client-side authentication utilities
 */

import { logout } from "./actions/auth.actions";

/**
 * Request sign-out. Checks for unsaved changes and shows confirmation if needed.
 * For now, immediately signs out. Will be extended to check planilla state.
 */
export async function requestSignOut(): Promise<void> {
  try {
    // TODO: Check for pending changes in planilla
    // For PR #3, we'll implement the basic flow
    
    // Clear any client-side state before signing out
    if (typeof window !== "undefined") {
      // Broadcast to other tabs
      try {
        const channel = new BroadcastChannel("auth");
        channel.postMessage({ type: "signed-out" });
        channel.close();
      } catch {
        // BroadcastChannel not supported, ignore
      }
    }
    
    // Server action to clear session
    await logout();
    
    // Hard redirect to clear client state
    if (typeof window !== "undefined") {
      window.location.replace("/login?estado=sesion-cerrada");
    }
  } catch (error) {
    console.error("Error during sign-out:", error);
    // Still redirect even if logout fails
    if (typeof window !== "undefined") {
      window.location.replace("/login?estado=sesion-cerrada");
    }
  }
}

/**
 * Sanitize callback URL to ensure it's safe
 */
export function sanitizeCallbackUrl(url: string | null): string {
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
  } catch {
    // Invalid URL, use default
  }
  
  return "/";
}
