import { PrismaClient } from "@prisma/client";
import { data } from "./transicion-seed";

const prisma = new PrismaClient();

// Define types for the transicion seed data
type TransicionStudentData = {
  apellido: string;
  descripcion?: string;
  desempeno?: string;
  horas?: number | string;
  nombre: string;
  nota?: string;
};

type TransicionSubjectData = {
  estudiantes: Record<string, TransicionStudentData>;
  nombre: string;
};

type TransicionData = {
  ano: number;
  grado: string;
  periodo: number;
  observaciones: Record<string, string>;
  [key: string]:
    | number
    | string
    | Record<string, string>
    | TransicionSubjectData;
};

export async function seedTransicionGrades() {
  console.log("Seeding Transición grades for Period 1, 2025...");

  const typedTransicionData = data as unknown as TransicionData;

  // Get the period and degree
  const period = await prisma.period.findUnique({
    where: {
      number_year: {
        number: typedTransicionData.periodo,
        year: typedTransicionData.ano,
      },
    },
  });

  if (!period) {
    console.error(
      `Period ${typedTransicionData.periodo} of year ${typedTransicionData.ano} not found`
    );
    return;
  }

  const degree = await prisma.degree.findUnique({
    where: { name: typedTransicionData.grado },
    include: { students: true },
  });

  if (!degree) {
    console.error(`Degree ${typedTransicionData.grado} not found`);
    return;
  }

  // Map the subject names from the seed data to the actual subject names
  // Transición has 8 subjects including Informática
  const subjectMapping: Record<string, string> = {
    asignatura1: "Comunicativa",
    asignatura2: "Cognitiva",
    asignatura3: "Corporal",
    asignatura4: "Ética y Valores",
    asignatura5: "Estética",
    asignatura6: "Inglés",
    asignatura7: "Comportamiento Social",
    asignatura8: "Informática",
  };

  // Map student names from seed data to actual student names for Transición
  const studentMapping: Record<string, string> = {
    estudiante1: "SARITH MILENA CORREA GUARDO",
    estudiante2: "ALANNA NICOL CASTILLO FERNÁNDEZ",
    estudiante3: "SANTIAGO ISAAC PUERTAS CEBALLOS",
    estudiante4: "ABIGAIL EBRATH RODRÍGUEZ",
    estudiante5: "MARIA PAULA CORREA MARTÍNEZ",
    estudiante6: "ISAAC DAVID JIMÉNEZ RINCÓN",
    estudiante7: "ALAM DAVID MORA SUÁREZ",
    estudiante8: "MATIAS DAVID SALGADO PERIÑÁN",
    estudiante9: "DEWIS JAVIER CASTILLO OLIVERA",
    estudiante10: "CESAR DANIEL GRANADILLO CARRASQUERO",
    estudiante11: "TIFFANY BENAVIDES PITALÚA",
    estudiante12: "JERÓNIMO JOSÉ RODRÍGUEZ ZAPATEIRO",
    estudiante13: "JAIME ANTONIO RODRÍGUEZ ZAPATEIRO",
    estudiante14: "MAYNARA HERNÁNDEZ ARRIETA",
    estudiante15: "CHRISTOPHER MAZA BECERRA",
    estudiante16: "LUIS ÁNGEL JULIO SIERRA",
    estudiante17: "DANIEL ALEJANDRO ZABALETA CORREA",
    estudiante18: "VALERIA RIOS MARTÍNEZ",
    estudiante19: "SANTIAGO JOSÉ OROZCO GÓMEZ",
    estudiante20: "LIZ VANNESA GARCÍA PINEDA",
  };

  // Process each subject
  for (const [subjectKey, subjectData] of Object.entries(typedTransicionData)) {
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

    // Type guard to ensure subjectData is TransicionSubjectData
    if (
      typeof subjectData === "object" &&
      subjectData !== null &&
      "estudiantes" in subjectData
    ) {
      const typedSubjectData = subjectData as TransicionSubjectData;

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
    typedTransicionData.observaciones
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

  console.log("Transición grades and observations seeding completed!");
}
