import { PrismaClient } from "@prisma/client";
import { data } from "./quinto-seed";

const prisma = new PrismaClient();

// Define types for the quinto seed data
type QuintoStudentData = {
  apellido: string;
  descripcion?: string;
  desempeno?: string;
  horas?: number | string;
  nombre: string;
  nota?: string;
};

type QuintoSubjectData = {
  estudiantes: Record<string, QuintoStudentData>;
  nombre: string;
};

type QuintoData = {
  ano: number;
  grado: string;
  periodo: number;
  observaciones: Record<string, string>;
  [key: string]: number | string | Record<string, string> | QuintoSubjectData;
};

export async function seedQuintoGrades() {
  console.log("Seeding Quinto grades for Period 1, 2025...");

  const typedQuintoData = data as unknown as QuintoData;

  // Get the period and degree
  const period = await prisma.period.findUnique({
    where: {
      number_year: {
        number: typedQuintoData.periodo,
        year: typedQuintoData.ano,
      },
    },
  });

  if (!period) {
    console.error(
      `Period ${typedQuintoData.periodo} of year ${typedQuintoData.ano} not found`
    );
    return;
  }

  const degree = await prisma.degree.findUnique({
    where: { name: typedQuintoData.grado },
    include: { students: true },
  });

  if (!degree) {
    console.error(`Degree ${typedQuintoData.grado} not found`);
    return;
  }

  // Map the subject names from the seed data to the actual subject names
  // Quinto has 13 subjects including Informática y tecnología
  const subjectMapping: Record<string, string> = {
    asignatura1: "Lenguaje - Comprensión Lectora",
    asignatura2: "Ciencias Sociales",
    asignatura3: "Idioma Extranjero: Inglés",
    asignatura4: "Educación Religiosa",
    asignatura5: "Ética y Valores",
    asignatura7: "Educación Artística",
    asignatura8: "Educación Física",
    asignatura9: "Comportamiento Social",
    asignatura10: "Matemáticas",
    asignatura11: "Geometría",
    asignatura12: "Ciencias Naturales",
    asignatura13: "Informática y tecnología",
  };

  // Map student names from seed data to actual student names for Quinto
  const studentMapping: Record<string, string> = {
    estudiante1: "JHON SEBASTIAN ATENCIO LANG",
    estudiante2: "JOSÉ SEBASTIÁN ACENDRA BULA",
    estudiante3: "JHOSTYN DAVID PÉREZ CARRILLO",
    estudiante4: "JONÁS ZÁRATE MARTÍNEZ",
    estudiante5: "THIAGO ANDRE CASTRO GUERRA",
    estudiante6: "GABRIEL CERPA JIMÉNEZ",
    estudiante7: "SOFÍA IRIARTE ACOSTA",
    estudiante8: "SARA LUZ IRIARTE ACOSTA",
    estudiante9: "LUIS ÁNGEL MENESES MERCADO",
    estudiante10: "DIGNA DEL CARMEN PÉREZ VALDEZ",
    estudiante11: "YARIANA SOFÍA MORELOS BELLO",
    estudiante12: "MARTÍN FERNANDO TORRES GONZÁLEZ",
    estudiante13: "LHIAM JOSÉ POLO BERDUGO",
    estudiante14: "FIORELLA RODRÍGUEZ GARCÍA",
    estudiante15: "TALIANA SOFÍA OSORIO LEÓN",
    estudiante16: "JULIANA ALEJANDRA DE ALBA TRUJILLO",
    estudiante17: "ISABELLA MERCADO BANQUET",
    estudiante18: "JUAN MANUEL JULIO POMBO",
    estudiante19: "LUIS MARIO CASTILLO PÉREZ",
  };

  // Process each subject
  for (const [subjectKey, subjectData] of Object.entries(typedQuintoData)) {
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

    // Type guard to ensure subjectData is QuintoSubjectData
    if (
      typeof subjectData === "object" &&
      subjectData !== null &&
      "estudiantes" in subjectData
    ) {
      const typedSubjectData = subjectData as QuintoSubjectData;

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
    typedQuintoData.observaciones
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

  console.log("Quinto grades and observations seeding completed!");
}
