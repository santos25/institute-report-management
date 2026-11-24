export function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

/** Guarda el celular colombiano en 10 dígitos, sin indicativo. */
export function canonicalPhone(value: string): string | null {
  const digits = normalizePhone(value);
  if (!digits) return null;
  if (/^3\d{9}$/.test(digits)) return digits;
  if (/^573\d{9}$/.test(digits)) return digits.slice(2);
  return null;
}

export function validatePhone(value: string) {
  const digits = normalizePhone(value);
  if (!digits) return null;
  if (canonicalPhone(digits)) return null;
  return "El teléfono debe ser un celular colombiano de 10 dígitos.";
}

export function familyLoginUrl(origin: string) {
  return `${origin.trim().replace(/\/$/, "")}/familias/login`;
}

export function guardianWelcomeMessage(input: {
  name: string;
  identification: string;
  password: string;
  loginUrl: string;
}) {
  return [
    `Hola ${input.name}. El Instituto Angelitos Alegres habilitó tu acceso al portal de familias.`,
    "",
    `Enlace: ${input.loginUrl}`,
    `Usuario: ${input.identification}`,
    `Clave inicial: ${input.password}`,
    "",
    "En el primer ingreso debes crear tu propia clave.",
  ].join("\n");
}

export function whatsAppHref(phone: string, message: string) {
  const national = canonicalPhone(phone);
  if (!national) return null;
  return `https://wa.me/57${national}?text=${encodeURIComponent(message)}`;
}
