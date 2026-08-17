/**
 * Inserta UN alumno en un grado. No borra ni modifica a nadie más.
 *
 * Uso:
 *   npx tsx db/add-student.ts "Cuarto" "CRISTIAN JOSÉ BLANCO PRIETO"
 *   npm run db:add-student -- "Cuarto" "Nombre completo"
 *
 * El nombre del grado debe coincidir con Degree.name (ej. Cuarto, Jardín, Pre Jardín).
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

function normalizeSpaces(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

function foldName(name: string): string {
  return normalizeSpaces(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ñ/g, "n");
}

const prisma = new PrismaClient();

async function main() {
  const degreeNameRaw = process.argv[2];
  const studentNameRaw = process.argv[3];

  if (!degreeNameRaw || !studentNameRaw) {
    console.error(
      "Uso: npx tsx db/add-student.ts \"<Grado>\" \"<Nombre completo del alumno>\""
    );
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está definida");
  }

  const degreeName = normalizeSpaces(degreeNameRaw);
  const studentName = normalizeSpaces(studentNameRaw);

  const degree = await prisma.degree.findFirst({
    where: { name: degreeName },
  });

  if (!degree) {
    const all = await prisma.degree.findMany({ select: { name: true }, orderBy: { name: "asc" } });
    throw new Error(
      `No existe el grado “${degreeName}”. En la base hay: ${all.map((d) => d.name).join(", ")}`
    );
  }

  const existing = await prisma.student.findMany({
    where: { degreeId: degree.id },
    select: { id: true, name: true },
  });
  const clash = existing.find((s) => foldName(s.name) === foldName(studentName));
  if (clash) {
    console.error(
      `Ya hay un alumno con el mismo nombre (sin tildes) en este grado: “${clash.name}” (id=${clash.id}). No se insertó otro registro.`
    );
    process.exit(1);
  }

  const created = await prisma.student.create({
    data: {
      name: studentName,
      degreeId: degree.id,
      identification: "",
    },
  });

  console.log(`Alumno creado: “${created.name}” → ${degree.name} (id=${created.id})`);
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
