/**
 * Año académico activo para listar y guardar periodos.
 * Fija SCHOOL_YEAR en .env (p. ej. 2026) para que, con el padrón 2026,
 * la app use los periodos de ese año aunque el calendario aún marque 2025.
 */
export function getActiveSchoolYear(): number {
  const fromEnv = process.env.SCHOOL_YEAR;
  if (fromEnv) {
    const y = parseInt(fromEnv, 10);
    if (Number.isFinite(y) && y >= 2000 && y <= 2100) {
      return y;
    }
  }
  return new Date().getFullYear();
}
