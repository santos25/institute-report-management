/**
 * Crea o actualiza un administrador y un docente de prueba.
 * Es idempotente. Lee las contraseñas de SEED_ADMIN_PASSWORD y
 * SEED_TEACHER_PASSWORD. Si faltan y no es producción, usa valores
 * solo para pruebas locales.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const ADMIN_USERNAME = "admin";
const TEACHER_USERNAME = "docente";
const LOCAL_DEV_ADMIN_PASSWORD = "admin-dev-only";
const LOCAL_DEV_TEACHER_PASSWORD = "docente-dev-only";

const DEGREE_ORDER = [
  "Párvulo",
  "Pre Jardín",
  "Jardín",
  "Transición",
  "Primero",
  "Segundo",
  "Tercero",
  "Cuarto",
  "Quinto",
];

function passwordFromEnv(name: string, devFallback: string) {
  const value = process.env[name]?.trim();
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`${name} es obligatoria cuando NODE_ENV=production`);
  }
  return devFallback;
}

function sortDegrees<T extends { name: string }>(degrees: T[]) {
  return [...degrees].sort((a, b) => {
    const indexA = DEGREE_ORDER.indexOf(a.name);
    const indexB = DEGREE_ORDER.indexOf(b.name);
    if (indexA === -1 && indexB === -1) {
      return a.name.localeCompare(b.name, "es");
    }
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

async function main() {
  const { hashPassword } = await import("../lib/auth/password");
  const { default: prisma } = await import("./prisma");

  const adminPassword = passwordFromEnv(
    "SEED_ADMIN_PASSWORD",
    LOCAL_DEV_ADMIN_PASSWORD
  );
  const teacherPassword = passwordFromEnv(
    "SEED_TEACHER_PASSWORD",
    LOCAL_DEV_TEACHER_PASSWORD
  );

  const degrees = sortDegrees(await prisma.degree.findMany());
  const assigned = degrees.slice(0, 2);
  if (assigned.length < 2) {
    throw new Error(
      "Se necesitan al menos 2 grados existentes para asignar al docente de prueba."
    );
  }

  const [adminHash, teacherHash] = await Promise.all([
    hashPassword(adminPassword),
    hashPassword(teacherPassword),
  ]);

  await prisma.user.upsert({
    where: { username: ADMIN_USERNAME },
    update: {
      name: "Administrador",
      role: "ADMIN",
      password: adminHash,
      degrees: { set: [] },
    },
    create: {
      name: "Administrador",
      username: ADMIN_USERNAME,
      role: "ADMIN",
      password: adminHash,
    },
  });

  await prisma.user.upsert({
    where: { username: TEACHER_USERNAME },
    update: {
      name: "Docente de prueba",
      role: "TEACHER",
      password: teacherHash,
      degrees: { set: assigned.map((degree) => ({ id: degree.id })) },
    },
    create: {
      name: "Docente de prueba",
      username: TEACHER_USERNAME,
      role: "TEACHER",
      password: teacherHash,
      degrees: { connect: assigned.map((degree) => ({ id: degree.id })) },
    },
  });

  console.log(
    `Usuarios listos: ${ADMIN_USERNAME} (ADMIN), ${TEACHER_USERNAME} (TEACHER → ${assigned
      .map((degree) => degree.name)
      .join(", ")})`
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { default: prisma } = await import("./prisma");
    await prisma.$disconnect();
  });
