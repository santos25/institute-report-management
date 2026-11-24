export const ROLES = ["ADMIN", "TEACHER"] as const;

export type Role = (typeof ROLES)[number];

export type HeaderUser = {
  name: string;
  role: Role;
};

export function isRole(value: string): value is Role {
  return value === "ADMIN" || value === "TEACHER";
}

export function roleLabel(role: string): string {
  return role === "ADMIN" ? "Administrador" : "Docente";
}
