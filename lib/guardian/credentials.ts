import { randomInt } from "node:crypto";
export {
  canonicalPhone,
  familyLoginUrl,
  guardianWelcomeMessage,
  normalizePhone,
  validatePhone,
  whatsAppHref,
} from "./message";

const INITIAL_PASSWORD_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export const GUARDIAN_ACCESS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  PASSWORD_CHANGED: "PASSWORD_CHANGED",
  PASSWORD_RESET: "PASSWORD_RESET",
  VIEW_CHILD: "VIEW_CHILD",
} as const;

export function generateInitialPassword(length = 10) {
  let password = "";
  for (let index = 0; index < length; index += 1) {
    password += INITIAL_PASSWORD_ALPHABET[randomInt(INITIAL_PASSWORD_ALPHABET.length)];
  }
  return password;
}

export function cleanPersonName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function validatePersonName(name: string) {
  if (name.length < 2 || name.length > 120) {
    return "Escribe el nombre completo, entre 2 y 120 caracteres.";
  }
  return null;
}

export function normalizeCedula(value: string) {
  return value.replace(/\D/g, "");
}

export function validateCedula(cedula: string) {
  if (!/^\d{6,12}$/.test(cedula)) {
    return "La cédula debe tener entre 6 y 12 dígitos.";
  }
  return null;
}

export function validateChosenPassword(password: string, confirmation: string) {
  if (password.length < 8 || password.length > 128) {
    return "La clave debe tener entre 8 y 128 caracteres.";
  }
  if (password !== confirmation) {
    return "La confirmación no coincide con la clave.";
  }
  return null;
}
