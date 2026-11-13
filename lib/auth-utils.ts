/**
 * Shared authentication utilities (server/client compatible)
 */

/**
 * Sanitize callback URL to ensure it's safe
 * Server-compatible version (no window object)
 */
export function sanitizeCallbackUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  try {
    // Only allow relative paths that don't start with //
    if (url.startsWith("/") && !url.startsWith("//")) {
      return url;
    }
  } catch {
    // Invalid URL
  }
  
  return null;
}
