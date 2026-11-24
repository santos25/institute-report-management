/**
 * Comprueba en la base de desarrollo que el acudiente A solo ve a sus hijos
 * y que el bloqueo de clave funciona. Se niega a correr si DATABASE_URL no
 * apunta al compute de la rama cursor-planillas-ux-c6f5.
 *
 * No usar contra producción (br-dawn-cherry-a5uj1klx / ep-mute-tooth-a5ds18bt).
 */
import { config } from "dotenv";

config();

const ALLOWED_HOST = "ep-proud-truth-a5ucuh93";
const FORBIDDEN_HOST = "ep-mute-tooth-a5ds18bt";
const ALLOWED_BRANCH = "br-winter-sunset-a546kwpp";
const FORBIDDEN_BRANCH = "br-dawn-cherry-a5uj1klx";

function assertSafeDatabaseUrl() {
  const url = process.env.DATABASE_URL ?? "";
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    throw new Error("DATABASE_URL no es una URL válida.");
  }

  if (
    !host.includes(ALLOWED_HOST) ||
    host.includes(FORBIDDEN_HOST) ||
    url.includes(FORBIDDEN_BRANCH) ||
    !url.includes("/angelitos-db")
  ) {
    throw new Error(
      "Esta verificación solo puede correr en la rama cursor-planillas-ux-c6f5."
    );
  }

  console.log(`Base permitida: ${host}`);
}

assertSafeDatabaseUrl();

const CEDULA_A = "9000000011";
const CEDULA_B = "9000000022";
const INITIAL_A = "InicialA11";
const INITIAL_B = "InicialB22";
const CHILD_A = "NIÑO AISLAMIENTO A";
const CHILD_B = "NIÑO AISLAMIENTO B";

async function main() {
  const { hashPassword } = await import("../lib/auth/password");
  const { default: prisma } = await import("../db/prisma");
  const { authenticateGuardian, changeGuardianPassword } = await import(
    "../lib/auth/guardian-login"
  );
  const { listGuardianChildren } = await import("../lib/guardian/children");

  const branchRows = await prisma.$queryRawUnsafe<Array<{ branch: string | null }>>(
    "SELECT current_setting('neon.branch_id', true) AS branch"
  );
  const branch = branchRows[0]?.branch ?? "";
  console.log(`neon.branch_id: ${branch || "(no informado)"}`);
  if (branch === FORBIDDEN_BRANCH) {
    throw new Error("La conexión es la rama de producción. Se aborta.");
  }
  if (branch && branch !== ALLOWED_BRANCH) {
    throw new Error(`La rama ${branch} no es cursor-planillas-ux-c6f5. Se aborta.`);
  }

  const degree = await prisma.degree.findFirst({ orderBy: { name: "asc" } });
  if (!degree) throw new Error("No hay grados para crear estudiantes de prueba.");

  const guardianIds: string[] = [];
  const studentIds: string[] = [];

  async function cleanup() {
    if (studentIds.length > 0) {
      await prisma.student.deleteMany({ where: { id: { in: studentIds } } });
    }
    if (guardianIds.length > 0) {
      await prisma.guardianAccessLog.deleteMany({
        where: { guardianId: { in: guardianIds } },
      });
      await prisma.guardian.deleteMany({ where: { id: { in: guardianIds } } });
    }
  }

  try {
    await prisma.student.deleteMany({
      where: { name: { in: [CHILD_A, CHILD_B] }, identification: { in: ["TMP-A", "TMP-B"] } },
    });
    const leftovers = await prisma.guardian.findMany({
      where: { identification: { in: [CEDULA_A, CEDULA_B] } },
      select: { id: true },
    });
    if (leftovers.length > 0) {
      const ids = leftovers.map((guardian) => guardian.id);
      await prisma.student.updateMany({
        where: { guardianId: { in: ids } },
        data: { guardianId: null },
      });
      await prisma.guardianAccessLog.deleteMany({ where: { guardianId: { in: ids } } });
      await prisma.guardian.deleteMany({ where: { id: { in: ids } } });
    }

    const [guardianA, guardianB] = await Promise.all([
      prisma.guardian.create({
        data: {
          identification: CEDULA_A,
          name: "Acudiente Aislamiento A",
          phone: "3001111111",
          password: await hashPassword(INITIAL_A),
          mustChangePassword: true,
        },
      }),
      prisma.guardian.create({
        data: {
          identification: CEDULA_B,
          name: "Acudiente Aislamiento B",
          password: await hashPassword(INITIAL_B),
          mustChangePassword: true,
        },
      }),
    ]);
    guardianIds.push(guardianA.id, guardianB.id);

    const [childA, childB] = await Promise.all([
      prisma.student.create({
        data: {
          name: CHILD_A,
          identification: "TMP-A",
          degreeId: degree.id,
          guardianId: guardianA.id,
        },
      }),
      prisma.student.create({
        data: {
          name: CHILD_B,
          identification: "TMP-B",
          degreeId: degree.id,
          guardianId: guardianB.id,
        },
      }),
    ]);
    studentIds.push(childA.id, childB.id);

    const visibleA = await listGuardianChildren(guardianA.id);
    const visibleB = await listGuardianChildren(guardianB.id);
    const namesA = visibleA.map((child) => child.name);
    const namesB = visibleB.map((child) => child.name);

    if (namesA.length !== 1 || namesA[0] !== CHILD_A || namesA.includes(CHILD_B)) {
      throw new Error(`Aislamiento falló para A: ${namesA.join(", ")}`);
    }
    if (namesB.length !== 1 || namesB[0] !== CHILD_B || namesB.includes(CHILD_A)) {
      throw new Error(`Aislamiento falló para B: ${namesB.join(", ")}`);
    }
    console.log("Aislamiento: A solo ve a su hijo y B solo ve al suyo.");

    for (let attempt = 1; attempt <= 4; attempt += 1) {
      const failed = await authenticateGuardian(CEDULA_A, "clave-mala");
      if (failed.ok || !failed.error.includes("incorrectos")) {
        throw new Error(`El intento ${attempt} no respondió como clave incorrecta.`);
      }
    }
    const fifth = await authenticateGuardian(CEDULA_A, "clave-mala");
    if (fifth.ok || !fifth.error.includes("bloqueada")) {
      throw new Error(`El quinto fallo no bloqueó: ${fifth.ok ? "ok" : fifth.error}`);
    }
    const locked = await authenticateGuardian(CEDULA_A, INITIAL_A);
    if (locked.ok || !locked.error.includes("bloqueada")) {
      throw new Error(`Se esperaba bloqueo y se obtuvo: ${locked.ok ? "ok" : locked.error}`);
    }
    console.log("Bloqueo: al quinto intento la cuenta queda bloqueada 15 minutos.");

    await prisma.guardian.update({
      where: { id: guardianA.id },
      data: { lockedUntil: new Date(Date.now() - 1000), failedAttempts: 5 },
    });
    const reopened = await authenticateGuardian(CEDULA_A, INITIAL_A);
    if (!reopened.ok || !reopened.guardian.mustChangePassword) {
      throw new Error("Tras vencer el bloqueo no se pudo ingresar con la clave inicial.");
    }
    const changed = await changeGuardianPassword({
      guardianId: guardianA.id,
      password: "clave-propia-a",
      confirmation: "clave-propia-a",
    });
    if (!changed.ok) throw new Error(changed.error);
    const withOwnPassword = await authenticateGuardian(CEDULA_A, "clave-propia-a");
    if (!withOwnPassword.ok || withOwnPassword.guardian.mustChangePassword) {
      throw new Error("La clave propia no quedó activa.");
    }
    console.log("Clave: el primer ingreso obliga a cambiarla y luego la propia funciona.");
    console.log("Verificación de aislamiento en base de datos: correcta.");
  } finally {
    await cleanup();
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
