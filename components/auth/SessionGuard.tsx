"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * SessionGuard component for protected pages
 * - Reloads if page is restored from bfcache
 * - Periodically checks session validity
 */
export function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    // Handle bfcache (back/forward cache) restoration
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache, reload to check session
        window.location.reload();
      }
    };

    // Check session on visibility change
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        try {
          const response = await fetch("/api/auth/session");
          const session = await response.json();
          
          if (!session || !session.user) {
            // Session expired, redirect to login
            window.location.replace(
              `/login?estado=sesion-expirada&callbackUrl=${encodeURIComponent(
                window.location.pathname + window.location.search
              )}`
            );
          }
        } catch (error) {
          console.error("Error checking session:", error);
        }
      }
    };

    // Check session every 5 minutes while page is visible
    let sessionCheckInterval: NodeJS.Timeout | null = null;
    
    const startSessionCheck = () => {
      sessionCheckInterval = setInterval(() => {
        if (document.visibilityState === "visible") {
          handleVisibilityChange();
        }
      }, 5 * 60 * 1000); // 5 minutes
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    startSessionCheck();

    // Listen for sign-out broadcasts from other tabs
    try {
      const channel = new BroadcastChannel("auth");
      channel.onmessage = (event) => {
        if (event.data.type === "signed-out") {
          window.location.replace("/login?estado=sesion-cerrada");
        }
      };

      return () => {
        window.removeEventListener("pageshow", handlePageShow);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (sessionCheckInterval) clearInterval(sessionCheckInterval);
        channel.close();
      };
    } catch {
      // BroadcastChannel not supported, clean up other listeners only
      return () => {
        window.removeEventListener("pageshow", handlePageShow);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (sessionCheckInterval) clearInterval(sessionCheckInterval);
      };
    }
  }, [router]);

  return null;
}
