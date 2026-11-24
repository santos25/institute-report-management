export const GUARDIAN_MAX_FAILED_ATTEMPTS = 5;
export const GUARDIAN_LOCK_MS = 15 * 60 * 1000;

export const GUARDIAN_INVALID_LOGIN =
  "Cédula o clave incorrectos.";
export const GUARDIAN_LOCKED_LOGIN =
  "Demasiados intentos fallidos. La cuenta está bloqueada durante 15 minutos.";

export function isGuardianLocked(lockedUntil: Date | null, now: Date) {
  return lockedUntil !== null && lockedUntil.getTime() > now.getTime();
}

export function registerFailedAttempt(
  state: { failedAttempts: number; lockedUntil: Date | null },
  now: Date
): { failedAttempts: number; lockedUntil: Date | null; locked: boolean } {
  const expired =
    state.lockedUntil !== null && state.lockedUntil.getTime() <= now.getTime();
  const base = expired ? 0 : state.failedAttempts;
  const next = base + 1;

  if (next >= GUARDIAN_MAX_FAILED_ATTEMPTS) {
    return {
      failedAttempts: GUARDIAN_MAX_FAILED_ATTEMPTS,
      lockedUntil: new Date(now.getTime() + GUARDIAN_LOCK_MS),
      locked: true,
    };
  }

  return { failedAttempts: next, lockedUntil: null, locked: false };
}
