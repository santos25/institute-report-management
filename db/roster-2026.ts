/**
 * Sincroniza el listado de estudiantes por grado para el año 2026.
 * - Crea (si faltan) los periodos 1–4 con year=2026
 * - Asigna/crea estudiantes según el padrón (actualiza degreeId o inserta)
 * - Elimina de la base a quienes ya no estén en el padrón (y sus notas/observaciones)
 *
 * Uso: npx tsx db/roster-2026.ts
 *      npx tsx db/roster-2026.ts --dry-run
 *
 * Requiere DATABASE_URL en .env
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const YEAR = 2026;
const DRY = process.argv.includes("--dry-run");

const prisma = new PrismaClient();

/** Nombres exactos de grado en app (ver lib/utils sortDegrees) + alias en BD. */
const DEGREE_RESOLUTION_ORDER: Record<string, string[]> = {
  Párvulo: ["Párvulo"],
  "Pre Jardín": ["Pre Jardín", "Prejardín", "Pre Jardin"],
  Jardín: ["Jardín", "Jardin"],
  Transición: ["Transición", "Transicion"],
  Primero: ["Primero"],
  Segundo: ["Segundo"],
  Tercero: ["Tercero"],
  Cuarto: ["Cuarto"],
  Quinto: ["Quinto"],
};

const ROSTER: Record<keyof typeof DEGREE_RESOLUTION_ORDER, string[]> = {
  Párvulo: [
    "ANDRÉS FELIPE MARTÍNEZ CAICEDO",
    "STEFANO HERRERA BOLIVAR",
    "DULCE ISABEL PUELLO MARSIGLIA",
    "MATIAS GUERRA ESCOBAR",
    "SANTIAGO RAAD COBA",
    "MEREDITH SOFÍA PALOMINO COHEN",
    "SALVADOR DÍAZ BOTET",
  ],
  "Pre Jardín": [
    "MATIAS ALEJANDRO CABALLERO PRADA",
    "MATIAS SALAZAR GÓMEZ",
    "SALOMÓN BARRIOS MATOZA",
    "JUAN FELIPE PÉREZ SÁNCHEZ",
    "DIEGO GONZÁLEZ MARTÍNEZ",
    "ISAAC IRIARTE JIMÉNEZ",
  ],
  Jardín: [
    "NICOLAS OCAMPO COGOLLO",
    "ALESSANDRO SMITH BERRÍO ACUÑA",
    "HEYCEL MELÉNDEZ MARTÍNEZ",
    "LUCAS DAVID AHUMEDO PEÑA",
    "LUCIANNA JULIO VEGA",
    "ALANNA SOFIA BADEL VÁSQUEZ",
    "THIANA SOFÍA URSHELA ALMANZA",
    "IVANNA LORDUY JULIO",
    "DINA MARIA DE LA ROSA TOLEDO",
    "SAMUEL DE JESÚS CÁRDENAS COGOLLO",
    "LUCIANA GONZÁLEZ RUIZ",
    "LUCIANA ELENA REYES VÁSQUEZ",
    "ELIECER DAVID GUERRERO VILLANUEVA",
    "JACK ANDRÉS LONDOÑO ORTEGA",
    "ASHLEY SANNEM ROMERO PEÑA",
    "JEREMIAS OTERO MIRANDA",
    "ANGEL GABRIEL HERRERA PULIDO",
    "DREYK MANCILLA JARAVA",
    "DILAN DAVID GRACIA RAMOS",
  ],
  Transición: [
    "EMIR EBRATH RODRIGUEZ",
    "ROTVIC ARAN FLORES AUGUSTO",
    "ELIETH IRENA JULIO POMBO",
    "REBECCA SARMIENTO RODRIGUEZ",
    "DANYELIS DAYANA MIRANDA ARAGÓN",
    "MICHELLE ROMERO REYES",
    "SALOME CASTRO TOSCANO",
    "LUCÍA ESPRIELLA ZUÑIGA",
    "LUZ ELENA VALDÉS HERNÁNDEZ",
    "MARYAN CASTELLANO AVILA",
    "MATÍAS MELÉNDEZ BECERRA",
    "JULIETA MENDOZA CASTILLO",
    "SALOME VEGA CABALLERO",
    "MATEO DE JESÚS JARABA OSPINO",
    "BRYANT MATIAS NAVARRO CASTILLO",
  ],
  Primero: [
    "SARITH MILENA CORREA GUARDO",
    "ALANNA NICOL CASTILLO FERNÁNDEZ",
    "SANTIAGO ISAAC PUERTAS CEBALLOS",
    "ABIGAIL EBRATH RODRIGUEZ",
    "NICOLAS ARTURO HERRERA PULIDO",
    "ISAAC DAVID JIMÉNEZ RINCÓN",
    "ALAM DAVID MORA SUÁREZ",
    "MATIAS DAVID SALGADO PERIÑÁN",
    "ANTONELLA SOPHIA ROMERO CONTRERA",
    "SEBASTIAN DAVID PÉREZ SÁNCHEZ",
    "MAYNARA HERNÁNDEZ ARRIETA",
    "LUIS ÁNGEL JULIO SIERRA",
    "DANIEL ALEJANDRO ZABALETA CORREA",
    "SANTIAGO JOSÉ OROZCO GÓMEZ",
    "LIZ VANNESA GARCÍA PINEDA",
    "CESAR DANIEL GRANADILLO CARRASQUERO",
    "MARIA DE LOS ANGELES MONTOYA ESTUPIÑÁN",
    "NEVIS ESTHER SERRANO TORRES",
  ],
  Segundo: [
    "ENRRIQUE LUIS OVIEDO CAMARGO",
    "JULIAN MARIO MONTERROSA OSPINO",
    "SARA LUCIA BARRERA OLMOS",
    "NAILETH DANAIS VÁSQUEZ GELES",
    "KILIAN MEJÍA CARAZO",
    "ALEJANDRO ABRAHAM GIL GRANADILLO",
    "ALEJANDRO MIELES CANDIA",
    "DYLAN CASTELLAR SÁNCHEZ",
    "THIAGO ANDRÉS REALES ZAMBRANO",
    "ETHAN STEFAN BATISTA DIAZ",
    "LINDA GABRIELA DÍAZ PACHECO",
    "LYANNE VALENTINA BLANCO ALMANZA",
    "ESTEBAN DAVID PINEDA JIMÉNEZ",
  ],
  Tercero: [
    "AHITANA PÉREZ BOHORQUEZ",
    "SAMUEL DAVID ANAYA CASTELLAR",
    "DOMINICK GRISOLLES RAMÍREZ",
    "CARLOS ANDRÉS MONTOYA ESTUPIÑÁN",
    "ELIAN DAVID SÁNCHEZ PÉREZ",
    "MARÍA FERNANDA LÓPEZ CABRERA",
    "SARA SOFÍA GÓMEZ OLMOS",
    "SANTIAGO ARTURO RODRIGUEZ FLÓREZ",
    "NICOLÁS PÉREZ DURÁN",
    "ELIF PAOLA MEZA",
    "ABIGAIL MERCADO FORBES",
    "YULIAM DE JESÚS GONZÁLEZ RUIZ",
    "BRIANNA SIERRA MEZA",
    "SANTIAGO EMILIO FERNÁNDEZ BENITOREBOLLO",
    "JULIAN MARCELO AMADO TOLEDO",
  ],
  Cuarto: [
    "JUAN ESTEBAN OSORIO LARA",
    "MATHIAS ALBERTO ORTÍZ LOZANO",
    "MICHELLE SARAY RUIZ NUÑEZ",
    "PAULA ANTONIA GUZMÁN SALAZAR",
    "MYLAN MARIMÓN RIVERA",
    "AINARA PEREIRA TOSCANO",
    "VICTORIA SOFÍA PUELLO ROSALES",
    "YULIANIS TEHERÁN PÉREZ",
    "LUIS ÁNGEL MORALES OSPINO",
    "SEBASTIÁN SAID LEÓN ANAYA",
    "ELIAS HERRERA JULIO",
    "ESTEBAN LUIS ANGÚLO PÉREZ",
    "ARIANIS SOFÍA LEONES SERPA",
    "THIAGO MATHIAS BECERRA MARTÍNEZ",
    "AARON DAVID ROMERO JAAMAN",
  ],
  Quinto: [
    "AARON MIELES CANDIA",
    "MARÍA SALOMÉ ROMERO SALCEDO",
    "JERÓNIMO BARÓN MARTELO",
    "DANIEL DAVID HERRERA PRADA",
    "SAID ANDRÉS CARRASQUILLA CONTRERAS",
    "ISAÍAS JOSÉ CASTRO TOSCANO",
    "ANILEC MELÉNDEZ MARTÍNEZ",
    "JUAN SEBASTIÁN RODRIGUEZ FLÓREZ",
    "SANTHIAGO MIGUEL POLANCO LUNA",
    "JUAN DE DIOS DE AGUAS FUNIELES",
    "MIA AILEVE POLO BERDUGO",
    "SHARENNY CASTELLAR SÁNCHEZ",
    "VALERI SOFIA MANRIQUE BALTAZAR",
    "JUAN FELIPE CAICEDO CASTILLO",
    "ISABELLA SOPHIA MELÉNDEZ BECERRA",
  ],
};

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

/** Igualar mayúsculas y tildes (Ñ/É/…) para emparejar con nombres ya guardados en la BD. */
function foldName(name: string): string {
  return normalizeName(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ñ/g, "n");
}

function buildDegreeIdMap(degrees: { id: string; name: string }[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const [logical, candidates] of Object.entries(DEGREE_RESOLUTION_ORDER)) {
    for (const candidate of candidates) {
      const found = degrees.find((d) => d.name === candidate);
      if (found) {
        map.set(logical, found.id);
        break;
      }
    }
    if (!map.has(logical)) {
      throw new Error(
        `No se encontró el grado “${logical}” (candidatos: ${candidates.join(", ")}). ` +
          `En la base hay: ${degrees.map((d) => d.name).join(", ")}`
      );
    }
  }
  return map;
}

function collectRosterNameKeys(): { pairs: [string, string][]; foldToCanonical: Map<string, string> } {
  const pairs: [string, string][] = [];
  const foldToCanonical = new Map<string, string>();

  for (const [degreeKey, list] of Object.entries(ROSTER) as [string, string[]][]) {
    for (const raw of list) {
      const n = normalizeName(raw);
      pairs.push([degreeKey, n]);
      const f = foldName(n);
      if (foldToCanonical.has(f) && foldToCanonical.get(f) !== n) {
        throw new Error(
          `Colisión al ignorar tildes: “${foldToCanonical.get(f)}” y “${n}” — unifica el nombre en ROSTER.`
        );
      }
      foldToCanonical.set(f, n);
    }
  }
  return { pairs, foldToCanonical };
}

async function ensurePeriods2026() {
  for (const number of [1, 2, 3, 4] as const) {
    if (DRY) {
      console.log(`[dry-run] period upsert year=${YEAR} number=${number}`);
      continue;
    }
    await prisma.period.upsert({
      where: {
        number_year: { number, year: YEAR },
      },
      create: { number, year: YEAR },
      update: {},
    });
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está definida");
  }

  const { pairs, foldToCanonical } = collectRosterNameKeys();
  const isOnRoster = (s: string) => foldToCanonical.has(foldName(s));

  const degrees = await prisma.degree.findMany();
  const degreeIdByLogical = buildDegreeIdMap(degrees);
  const allInDb = await prisma.student.findMany();

  if (DRY) {
    console.log("— Modo --dry-run: no se escribirá en la base —\n");
  }

  await ensurePeriods2026();

  for (const [logicalKey, nameKey] of pairs) {
    const degreeId = degreeIdByLogical.get(logicalKey)!;
    const f = foldName(nameKey);
    const matches = allInDb.filter((s) => foldName(s.name) === f);

    if (DRY) {
      if (matches.length === 0) {
        console.log(`[crear] “${nameKey}” → ${logicalKey}`);
      } else {
        for (const m of matches) {
          const ch = m.degreeId !== degreeId;
          console.log(
            ch
              ? `[mover] “${m.name}” id=${m.id} → ${logicalKey} (${m.degreeId} → ${degreeId})`
              : `[ok]   “${m.name}” ya en ${logicalKey}`
          );
        }
      }
      continue;
    }

    if (matches.length === 0) {
      const created = await prisma.student.create({
        data: {
          name: nameKey,
          degreeId,
          identification: "",
        },
      });
      allInDb.push(created);
      console.log(`+ Creado: ${nameKey} → ${logicalKey}`);
    } else {
      for (const m of matches) {
        if (m.name === nameKey && m.degreeId === degreeId) {
          // ya alineado con el padrón
        } else {
          const updated = await prisma.student.update({
            where: { id: m.id },
            data: { name: nameKey, degreeId },
          });
          const idx = allInDb.findIndex((x) => x.id === m.id);
          if (idx >= 0) allInDb[idx] = updated;
        }
        if (m.name !== nameKey) {
          console.log(`~ Ajuste nombre/curso: ${m.name} → ${nameKey} → ${logicalKey}`);
        } else if (m.degreeId !== degreeId) {
          console.log(`~ Curso: ${nameKey} → ${logicalKey}`);
        }
      }
      if (matches.length > 1) {
        console.warn(`! ${matches.length} filas con el mismo padrón (sin tildes): “${nameKey}” — todas fijadas a ${logicalKey}`);
      }
    }
  }

  const toDeleteRows = allInDb.filter((s) => !isOnRoster(s.name));
  const deleteIds = toDeleteRows.map((s) => s.id);

  if (DRY) {
    for (const s of toDeleteRows) {
      console.log(`[eliminar] id=${s.id} “${s.name}”`);
    }
    console.log("\n[dry-run] Hecho (sin borrar alumnos; periodos y altas/migraciones arriba solo simulados).");
    return;
  }

  if (deleteIds.length) {
    const delGrades = await prisma.studentGrade.deleteMany({ where: { studentId: { in: deleteIds } } });
    const delObs = await prisma.studentObservation.deleteMany({ where: { studentId: { in: deleteIds } } });
    const delSt = await prisma.student.deleteMany({ where: { id: { in: deleteIds } } });
    console.log(
      `Eliminados: ${delSt.count} alumno(s), ${delGrades.count} nota(s), ${delObs.count} observación(es) heredada(s).`
    );
  } else {
    console.log("Nadie que eliminar fuera del padrón.");
  }

  console.log("Listo: padrón 2026 y periodos 1–4 para el año 2026.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
