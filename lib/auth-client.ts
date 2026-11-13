"use client";

/**
 * Client-side authentication utilities
 */

import { logout } from "./actions/auth.actions";
import {
  hasUnsavedChanges,
  waitForSaves,
  clearPlanillaState,
  getPlanillaState,
} from "./planillas-state";

/**
 * Callback to show unsaved changes dialog
 * Components can set this to control the dialog display
 */
let showUnsavedChangesDialog: ((
  affectedStudents: Array<{ name: string; reason: string; value?: string }>,
  onConfirm: () => void,
  onCancel: () => void
) => void) | null = null;

export function setShowUnsavedChangesDialog(
  handler: typeof showUnsavedChangesDialog
) {
  showUnsavedChangesDialog = handler;
}

/**
 * Request sign-out. Checks for unsaved changes and shows confirmation if needed.
 */
export async function requestSignOut(): Promise<void> {
  try {
    // Check for pending changes in planilla
    const unsavedState = hasUnsavedChanges();
    
    if (unsavedState.isSaving) {
      // Wait up to 3 seconds for in-flight saves to complete
      await waitForSaves(3000);
      
      // Re-check after waiting
      const recheckState = hasUnsavedChanges();
      if (recheckState.has && showUnsavedChangesDialog) {
        // Still have unsaved changes, show confirmation dialog
        return new Promise<void>((resolve) => {
          showUnsavedChangesDialog!(
            recheckState.affectedStudents,
            () => {
              // User confirmed, proceed with sign-out
              performSignOut();
              resolve();
            },
            () => {
              // User cancelled
              resolve();
            }
          );
        });
      }
    } else if (unsavedState.has && showUnsavedChangesDialog) {
      // Have unsaved changes but not saving, show confirmation immediately
      return new Promise<void>((resolve) => {
        showUnsavedChangesDialog!(
          unsavedState.affectedStudents,
          () => {
            performSignOut();
            resolve();
          },
          () => {
            resolve();
          }
        );
      });
    }
    
    // No unsaved changes, sign out immediately
    await performSignOut();
  } catch (error) {
    console.error("Error during sign-out:", error);
    // Still redirect even if logout fails
    if (typeof window !== "undefined") {
      window.location.replace("/login?estado=sesion-cerrada");
    }
  }
}

/**
 * Perform the actual sign-out
 */
async function performSignOut(): Promise<void> {
  // Clear planilla state
  clearPlanillaState();
  
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
