/**
 * Comprueba en la base de desarrollo que el detalle de un hijo solo
 * devuelve el año actual de ESE acudiente, y que un id ajeno no filtra datos.
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
const CHILD_A = "NIÑO DETALLE A";
const CHILD_B = "NIÑO DETALLE B";

async function main() {
  const { default: prisma } = await import("../db/prisma");
  const { getActiveSchoolYear } = await import("../lib/school-year");
  const { getGuardianChildDetail } = await import("../lib/guardian/load-child-detail");
  const { childDetailAction } = await import("../lib/guardian/child-detail");

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

  const year = getActiveSchoolYear();
  const degree = await prisma.degree.findFirst({ orderBy: { name: "asc" } });
  const subject = await prisma.subject.findFirst({ orderBy: { name: "asc" } });
  if (!degree || !subject) {
    throw new Error("Faltan grados o materias para la prueba.");
  }

  const currentPeriod = await prisma.period.findFirst({
    where: { year },
    orderBy: { number: "asc" },
  });
  if (!currentPeriod) {
    throw new Error(`No hay periodos del año ${year} en la copia de desarrollo.`);
  }

  const otherYear = year === 2099 ? 2098 : 2099;
  const guardianIds: string[] = [];
  const studentIds: string[] = [];
  let otherPeriodId: string | null = null;
  let createdOtherPeriod = false;

  async function cleanup() {
    if (studentIds.length > 0) {
      await prisma.studentGrade.deleteMany({ where: { studentId: { in: studentIds } } });
      await prisma.studentObservation.deleteMany({
        where: { studentId: { in: studentIds } },
      });
      await prisma.student.deleteMany({ where: { id: { in: studentIds } } });
    }
    if (guardianIds.length > 0) {
      await prisma.guardianAccessLog.deleteMany({
        where: { guardianId: { in: guardianIds } },
      });
      await prisma.guardian.deleteMany({ where: { id: { in: guardianIds } } });
    }
    if (createdOtherPeriod && otherPeriodId) {
      const remaining = await prisma.studentGrade.count({
        where: { periodId: otherPeriodId },
      });
      if (remaining === 0) {
        await prisma.period.deleteMany({ where: { id: otherPeriodId } });
      }
    }
  }

  try {
    const existingOther = await prisma.period.findFirst({
      where: { number: 1, year: otherYear },
    });
    const otherPeriod =
      existingOther ??
      (await prisma.period.create({ data: { number: 1, year: otherYear } }));
    otherPeriodId = otherPeriod.id;
    createdOtherPeriod = !existingOther;

    const leftovers = await prisma.guardian.findMany({
      where: { identification: { in: [CEDULA_A, CEDULA_B] } },
      select: { id: true },
    });
    if (leftovers.length > 0) {
      const ids = leftovers.map((guardian) => guardian.id);
      const oldStudents = await prisma.student.findMany({
        where: { guardianId: { in: ids } },
        select: { id: true },
      });
      const oldIds = oldStudents.map((student) => student.id);
      if (oldIds.length > 0) {
        await prisma.studentGrade.deleteMany({ where: { studentId: { in: oldIds } } });
        await prisma.studentObservation.deleteMany({ where: { studentId: { in: oldIds } } });
        await prisma.student.deleteMany({ where: { id: { in: oldIds } } });
      }
      await prisma.guardianAccessLog.deleteMany({ where: { guardianId: { in: ids } } });
      await prisma.guardian.deleteMany({ where: { id: { in: ids } } });
    }

    const [guardianA, guardianB] = await Promise.all([
      prisma.guardian.create({
        data: {
          identification: CEDULA_A,
          name: "Acudiente Detalle A",
          password: "hash-no-usado",
        },
      }),
      prisma.guardian.create({
        data: {
          identification: CEDULA_B,
          name: "Acudiente Detalle B",
          password: "hash-no-usado",
        },
      }),
    ]);
    guardianIds.push(guardianA.id, guardianB.id);

    const [childA, childB] = await Promise.all([
      prisma.student.create({
        data: {
          name: CHILD_A,
          identification: "TMP-DET-A",
          degreeId: degree.id,
          guardianId: guardianA.id,
        },
      }),
      prisma.student.create({
        data: {
          name: CHILD_B,
          identification: "TMP-DET-B",
          degreeId: degree.id,
          guardianId: guardianB.id,
        },
      }),
    ]);
    studentIds.push(childA.id, childB.id);

    await prisma.studentGrade.createMany({
      data: [
        {
          studentId: childA.id,
          subjectId: subject.id,
          periodId: currentPeriod.id,
          grade: 4.2,
          achievements: "Logro solo de A",
        },
        {
          studentId: childA.id,
          subjectId: subject.id,
          periodId: otherPeriod.id,
          grade: 5,
          achievements: "Logro de otro año",
        },
        {
          studentId: childB.id,
          subjectId: subject.id,
          periodId: currentPeriod.id,
          grade: 1.5,
          achievements: "Logro solo de B",
        },
      ],
    });
    await prisma.studentObservation.createMany({
      data: [
        {
          studentId: childA.id,
          periodId: currentPeriod.id,
          content: "Observación solo de A",
        },
        {
          studentId: childB.id,
          periodId: currentPeriod.id,
          content: "Observación solo de B",
        },
      ],
    });

    const own = await getGuardianChildDetail({
      guardianId: guardianA.id,
      studentId: childA.id,
      year,
    });
    if (!own || own.student.name !== CHILD_A) {
      throw new Error("A no vio el detalle de su hijo.");
    }
    const serialized = JSON.stringify(own);
    if (
      serialized.includes(CHILD_B) ||
      serialized.includes("Logro solo de B") ||
      serialized.includes("Observación solo de B") ||
      serialized.includes("Logro de otro año") ||
      own.year !== year
    ) {
      throw new Error("El detalle de A filtró otro niño u otro año.");
    }
    const period = own.periods.find((item) => item.number === currentPeriod.number);
    if (!period || period.subjects[0]?.grade !== 4.2 || period.observation !== "Observación solo de A") {
      throw new Error("El detalle de A no trajo su nota o su observación.");
    }
    console.log("Detalle: A ve su nota, su logro y su observación del año actual.");

    const foreign = await getGuardianChildDetail({
      guardianId: guardianA.id,
      studentId: childB.id,
      year,
    });
    if (foreign !== null) {
      throw new Error("A obtuvo datos del hijo de B.");
    }
    const missing = await getGuardianChildDetail({
      guardianId: guardianA.id,
      studentId: "no-existe",
      year,
    });
    if (missing !== null) {
      throw new Error("Un id inexistente devolvió datos.");
    }
    console.log("Aislamiento: el id del hijo de B y un id inexistente no devuelven datos.");

    const logs = await prisma.guardianAccessLog.findMany({
      where: { guardianId: guardianA.id },
    });
    const expected = childDetailAction(childA.id);
    if (logs.length !== 1 || logs[0]?.action !== expected) {
      throw new Error(`El registro de la vista no coincide: ${logs.map((log) => log.action).join(", ")}`);
    }
    const leaked = await prisma.guardianAccessLog.findFirst({
      where: { action: { contains: childB.id } },
    });
    if (leaked) throw new Error("Se registró la vista de un hijo ajeno.");
    console.log("Bitácora: solo quedó la vista del propio hijo.");
    console.log("Verificación del detalle en base de datos: correcta.");
  } finally {
    await cleanup();
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
