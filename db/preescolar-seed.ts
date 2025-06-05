import { PrismaClient } from "@prisma/client";
import { data } from "./jardin-seed";

const prisma = new PrismaClient();

// Define types for the jardin seed data
type JardinStudentData = {
  apellido: string;
  descripcion?: string;
  desempeno?: string;
  horas?: number | string;
  nombre: string;
  nota?: string;
};

type JardinSubjectData = {
  estudiantes: Record<string, JardinStudentData>;
  nombre: string;
};

type JardinData = {
  ano: number;
  grado: string;
  periodo: number;
  observaciones: Record<string, string>;
  [key: string]:
    | number
    | string
    | Record<string, string>
    | JardinSubjectData;
};

export async function seedPreescolarGrades() {
  console.log("Seeding Jardín grades for Period 1, 2025...");

  const typedJardinData = data as unknown as JardinData;

  // Get the period and degree
  const period = await prisma.period.findUnique({
    where: {
      number_year: {
        number: typedJardinData.periodo,
        year: typedJardinData.ano,
      },
    },
  });

  if (!period) {
    console.error(
      `Period ${typedJardinData.periodo} of year ${typedJardinData.ano} not found`
    );
    return;
  }

  const degree = await prisma.degree.findUnique({
    where: { name: typedJardinData.grado },
    include: { students: true },
  });

  if (!degree) {
    console.error(`Degree ${typedJardinData.grado} not found`);
    return;
  }

  // Map the subject names from the seed data to the actual subject names
  const subjectMapping: Record<string, string> = {
    asignatura1: "Comunicativa",
    asignatura2: "Cognitiva",
    asignatura3: "Corporal",
    asignatura4: "Ética y Valores",
    asignatura5: "Estética",
    asignatura6: "Inglés",
    asignatura7: "Comportamiento Social",
  };

  // Map student names from seed data to actual student names for Jardín
  const studentMapping: Record<string, string> = {
    estudiante1: "EMIR EBRATH RODRIGUEZ",
    estudiante2: "ROTVIC ARAN FLORES AUGUSTO",
    estudiante3: "THIAGO ANGÚLO CALDERÓN",
    estudiante4: "ELIETH IRENA JULIO POMBO",
    estudiante5: "REBECCA SARMIENTO RODRIGUEZ",
    estudiante6: "MICHELLE ROMERO REYES",
    estudiante7: "SALOME CASTRO TOSCANO",
    estudiante8: "LUCÍA ESPRIELLA ZUÑIGA",
    estudiante9: "LUZ ELENA VALDÉS HERNÁNDEZ",
    estudiante10: "MARYAN CASTELLANO AVILA",
    estudiante11: "MATÍAS MELÉNDEZ BECERRA",
    estudiante12: "JULIETA MENDOZA CASTILLO",
    estudiante13: "SALOME VEGA CABALLERO",
    estudiante14: "MATEO DE JESÚS JARABA OSPINO",
    estudiante15: "CARLOS DAVID CASSIANI NARVAEZ",
  };

  // Process each subject
  for (const [subjectKey, subjectData] of Object.entries(typedJardinData)) {
    if (!subjectKey.startsWith("asignatura")) continue;

    const subjectName = subjectMapping[subjectKey];
    if (!subjectName) continue;

    // Find the subject in the database
    const subject = await prisma.subject.findUnique({
      where: { name: subjectName },
    });

    if (!subject) {
      console.error(`Subject ${subjectName} not found`);
      continue;
    }

    // Type guard to ensure subjectData is JardinSubjectData
    if (
      typeof subjectData === "object" &&
      subjectData !== null &&
      "estudiantes" in subjectData
    ) {
      const typedSubjectData = subjectData as JardinSubjectData;

      // Process each student's grade for this subject
      for (const [studentKey, studentData] of Object.entries(
        typedSubjectData.estudiantes
      )) {
        const studentName = studentMapping[studentKey];
        if (!studentName) continue;

        // Skip students that don't have complete data
        if (!studentData.nota || !studentData.descripcion) {
          console.log(
            `⚠️ Skipping ${studentName} in ${subjectName} - incomplete data`
          );
          continue;
        }

        // Find the student in the database
        const student = degree.students.find((s) => s.name === studentName);
        if (!student) {
          console.error(
            `Student ${studentName} not found in degree ${degree.name}`
          );
          continue;
        }

        // Create the grade record
        try {
          await prisma.studentGrade.upsert({
            where: {
              studentId_subjectId_periodId: {
                studentId: student.id,
                subjectId: subject.id,
                periodId: period.id,
              },
            },
            update: {
              grade: parseFloat(studentData.nota),
              achievements: studentData.descripcion,
            },
            create: {
              studentId: student.id,
              subjectId: subject.id,
              periodId: period.id,
              grade: parseFloat(studentData.nota),
              achievements: studentData.descripcion,
            },
          });

          console.log(
            `✓ Grade created for ${studentName} in ${subjectName}: ${studentData.nota}`
          );
        } catch (error) {
          console.error(
            `Error creating grade for ${studentName} in ${subjectName}:`,
            error
          );
        }
      }
    }
  }

  // Seed student observations
  console.log("Seeding student observations...");
  for (const [studentKey, observationContent] of Object.entries(
    typedJardinData.observaciones
  )) {
    const studentName = studentMapping[studentKey];
    if (!studentName) continue;

    // Skip empty observations
    if (!observationContent || observationContent.trim() === "") {
      console.log(`⚠️ Skipping observation for ${studentName} - empty content`);
      continue;
    }

    const student = degree.students.find((s) => s.name === studentName);
    if (!student) {
      console.error(`Student ${studentName} not found for observation`);
      continue;
    }

    try {
      await prisma.studentObservation.upsert({
        where: {
          studentId_periodId: {
            studentId: student.id,
            periodId: period.id,
          },
        },
        update: {
          content: observationContent,
        },
        create: {
          studentId: student.id,
          periodId: period.id,
          content: observationContent,
        },
      });

      console.log(`✓ Observation created for ${studentName}`);
    } catch (error) {
      console.error(`Error creating observation for ${studentName}:`, error);
    }
  }

  console.log("Jardín grades and observations seeding completed!");
}
