// Define types for the seed data
type Period = {
  number: number;
  year: number;
};

type Degree = {
  name: string;
  subjects?: string;
  students?: string;
};

type Subject = {
  name: string;
};

type Student = {
  name: string;
  degree: string;
};

type SeedData = {
  periods: Period[];
  degrees: Degree[];
  subjects: Record<string, Subject[]>;
  students: Record<string, Student[]>;
};

const dataToSeed: SeedData = {
  periods: [
    {
      number: 1,
      year: 2025,
    },
    {
      number: 2,
      year: 2025,
    },
    {
      number: 3,
      year: 2025,
    },
    {
      number: 4,
      year: 2025,
    },
  ],
  degrees: [
    {
      name: "Párvulo",
      subjects: "parvulo",
      students: "parvulo",
    },
    {
      name: "Prejardín",
      subjects: "parvulo",
      students: "prejardin",
    },
    {
      name: "Jardín",
      subjects: "parvulo",
      students: "jardin",
    },
    {
      name: "Transición",
      subjects: "transicion",
      students: "transicion",
    },
    {
      name: "Primero",
      subjects: "primero",
      students: "primero",
    },
    {
      name: "Segundo",
      subjects: "primero",
      students: "segundo",
    },
    {
      name: "Tercero",
      subjects: "primero",
      students: "tercero",
    },
    {
      name: "Cuarto",
      subjects: "primero",
      students: "cuarto",
    },
    {
      name: "Quinto",
      subjects: "primero",
      students: "quinto",
    },
  ],
  subjects: {
    parvulo: [
      {
        name: "Comunicativa",
      },
      {
        name: "Cognitiva",
      },
      {
        name: "Corporal",
      },
      {
        name: "Ética y Valores",
      },
      {
        name: "Estética",
      },
      {
        name: "Inglés",
      },
      {
        name: "Comportamiento Social",
      },
    ],
    transicion: [
      {
        name: "Comunicativa",
      },
      {
        name: "Cognitiva",
      },
      {
        name: "Corporal",
      },
      {
        name: "Ética y Valores",
      },
      {
        name: "Estética",
      },
      {
        name: "Inglés",
      },
      {
        name: "Comportamiento Social",
      },
      {
        name: "Informática",
      },
    ],
    primero: [
      {
        name: "Lenguaje - Comprensión Lectora",
      },
      {
        name: "Matemáticas",
      },
      {
        name: "Geometría",
      },
      {
        name: "Ciencias Naturales",
      },
      {
        name: "Informática y tecnología",
      },
      {
        name: "Ciencias Sociales",
      },
      {
        name: "Idioma Extranjero: Inglés",
      },
      {
        name: "Educación Religiosa",
      },
      {
        name: "Ética y Valores",
      },
      {
        name: "Educación Artística",
      },
      {
        name: "Educación Física",
      },
      {
        name: "Comportamiento Social",
      },
    ],
  },
  students: {
    parvulo: [
      {
        name: "ASHLEY SANNEM ROMERO PEÑA",
        degree: "Párvulo",
      },
      {
        name: "CARLOS ENRIQUE ARELLANO GUERRA",
        degree: "Párvulo",
      },
      {
        name: "FERNANDA LIÑÁN ZAMBRANO",
        degree: "Párvulo",
      },
    ],
    prejardin: [
      {
        name: "NICOLAS OCAMPO COGOLLO",
        degree: "Prejardín",
      },
      {
        name: "DANNA SOFIA OSUNA ARROYO",
        degree: "Prejardín",
      },
      {
        name: "JULIO CÉSAR GONZÁLEZ DUARTE",
        degree: "Prejardín",
      },
      {
        name: "ALESSANDRO SMITH BERRÍO ACUÑA",
        degree: "Prejardín",
      },
      {
        name: "HEYCEL MELENDEZ MARTÍNEZ",
        degree: "Prejardín",
      },
      {
        name: "LUCAS DAVID AHUMEDO PEÑA",
        degree: "Prejardín",
      },
      {
        name: "LUCIANNA JULIO VEGA",
        degree: "Prejardín",
      },
      {
        name: "ALANNA SOFIA BADEL VÁSQUEZ",
        degree: "Prejardín",
      },
      {
        name: "THIANA SOFÍA URSHELA ALMANZA",
        degree: "Prejardín",
      },
      {
        name: "IVANNA LORDUY JULIO",
        degree: "Prejardín",
      },
      {
        name: "DINA MARIA DE LA ROSA TOLEDO",
        degree: "Prejardín",
      },
      {
        name: "SAMUEL DE JESÚS CÁRDENAS COGOLLO",
        degree: "Prejardín",
      },
      {
        name: "LUCIANA GONZÁLEZ RUIZ",
        degree: "Prejardín",
      },
      {
        name: "LUCIANA ELENA REYES VÁSQUEZ",
        degree: "Prejardín",
      },
      {
        name: "MIA MORALES GALINDO",
        degree: "Prejardín",
      },
    ],
    jardin: [
      {
        name: "EMIR EBRATH RODRIGUEZ",
        degree: "Jardín",
      },
      {
        name: "ROTVIC ARAN FLORES AUGUSTO",
        degree: "Jardín",
      },
      {
        name: "THIAGO ANGÚLO CALDERÓN",
        degree: "Jardín",
      },
      {
        name: "ELIETH IRENA JULIO POMBO",
        degree: "Jardín",
      },
      {
        name: "REBECCA SARMIENTO RODRIGUEZ",
        degree: "Jardín",
      },
      {
        name: "MICHELLE ROMERO REYES",
        degree: "Jardín",
      },
      {
        name: "SALOME CASTRO TOSCANO",
        degree: "Jardín",
      },
      {
        name: "LUCÍA ESPRIELLA ZUÑIGA",
        degree: "Jardín",
      },
      {
        name: "LUZ ELENA VALDÉS HERNÁNDEZ",
        degree: "Jardín",
      },
      {
        name: "MARYAN CASTELLANO AVILA",
        degree: "Jardín",
      },
      {
        name: "MATÍAS MELÉNDEZ BECERRA",
        degree: "Jardín",
      },
      {
        name: "JULIETA MENDOZA CASTILLO",
        degree: "Jardín",
      },
      {
        name: "SALOME VEGA CABALLERO",
        degree: "Jardín",
      },
      {
        name: "MATEO DE JESÚS JARABA OSPINO",
        degree: "Jardín",
      },
    ],
    transicion: [
      {
        name: "SARITH MILENA CORREA GUARDO",
        degree: "Transición",
      },
      {
        name: "ALANNA NICOL CASTILLO FERNÁNDEZ",
        degree: "Transición",
      },
      {
        name: "SANTIAGO ISAAC PUERTAS CEBALLOS",
        degree: "Transición",
      },
      {
        name: "ABIGAIL EBRATH RODRÍGUEZ",
        degree: "Transición",
      },
      {
        name: "MARIA PAULA CORREA MARTÍNEZ",
        degree: "Transición",
      },
      {
        name: "ISAAC DAVID JIMÉNEZ RINCÓN",
        degree: "Transición",
      },
      {
        name: "ALAM DAVID MORA SUÁREZ",
        degree: "Transición",
      },
      {
        name: "MATIAS DAVID SALGADO PERIÑÁN",
        degree: "Transición",
      },
      {
        name: "DEWIS JAVIER CASTILLO OLIVERA",
        degree: "Transición",
      },
      {
        name: "CESAR DANIEL GRANADILLO CARRASQUERO",
        degree: "Transición",
      },
      {
        name: "TIFFANY BENAVIDES PITALÚA",
        degree: "Transición",
      },
      {
        name: "JERÓNIMO JOSÉ RODRÍGUEZ ZAPATEIRO",
        degree: "Transición",
      },
      {
        name: "JAIME ANTONIO RODRÍGUEZ ZAPATEIRO",
        degree: "Transición",
      },
      {
        name: "MAYNARA HERNÁNDEZ ARRIETA",
        degree: "Transición",
      },
      {
        name: "CHRISTOPHER MAZA BECERRA",
        degree: "Transición",
      },
      {
        name: "LUIS ÁNGEL JULIO SIERRA",
        degree: "Transición",
      },
      {
        name: "DANIEL ALEJANDRO ZABALETA CORREA",
        degree: "Transición",
      },
      {
        name: "VALERIA RIOS MARTÍNEZ",
        degree: "Transición",
      },
      {
        name: "SANTIAGO JOSÉ OROZCO GÓMEZ",
        degree: "Transición",
      },
      {
        name: "LIZ VANNESA GARCÍA PINEDA",
        degree: "Transición",
      },
    ],
    primero: [
      {
        name: "ENRRIQUE LUIS OVIEDO CAMARGO",
        degree: "Primero",
      },
      {
        name: "JULIAN MARIO MONTERROSA OSPINO",
        degree: "Primero",
      },
      {
        name: "SARA LUCIA BARRERA OLMOS",
        degree: "Primero",
      },
      {
        name: "NAILETH DANAIS VÁSQUEZ GELES",
        degree: "Primero",
      },
      {
        name: "KILIAN MEJÍA CARAZO",
        degree: "Primero",
      },
      {
        name: "KAROL ELENA VILLAMIL MARTÍNEZ",
        degree: "Primero",
      },
      {
        name: "ALAN MATHIAS OROZCO BARRIENTOS",
        degree: "Primero",
      },
      {
        name: "ALEJANDRO ABRAHAM GIL GRANADILLO",
        degree: "Primero",
      },
      {
        name: "ALEJANDRO MIELES CANDIA",
        degree: "Primero",
      },
      {
        name: "DYLAN CASTELLAR SÁNCHEZ",
        degree: "Primero",
      },
      {
        name: "MARIANA ANTONELLA THERÁN CARDONA",
        degree: "Primero",
      },
      {
        name: "THIAGO JESÚS MENDOZA GONZÁLEZ",
        degree: "Primero",
      },
      {
        name: "ETHAN STEFAN BATISTA DIAZ",
        degree: "Primero",
      },
      {
        name: "MARIANA ZAPATA OCHOA",
        degree: "Primero",
      },
      {
        name: "SARA VALENTINA DE ALBA TRUJILLO",
        degree: "Primero",
      },
      {
        name: "LINDA GABRIELA DÍAZ PACHECO",
        degree: "Primero",
      },
      {
        name: "LUIS ÁNGEL CANO HERNÁNDEZ",
        degree: "Primero",
      },
      {
        name: "LUIS GABRIEL CANO HERNÁNDEZ",
        degree: "Primero",
      },
      {
        name: "DAVID LUIS CUADROS BLANCO",
        degree: "Primero",
      },
      {
        name: "LYANNE VALENTINA BLANCO ALMANZA",
        degree: "Primero",
      },
      {
        name: "ALAN DAVID RODRÍGUEZ REDONDO",
        degree: "Primero",
      },
      {
        name: "SANTIAGO DE LA BARRERA ROA",
        degree: "Primero",
      },
    ],
    segundo: [
      {
        name: "AHITANA PÉREZ BOHORQUEZ",
        degree: "Segundo",
      },
      {
        name: "SAMUEL DAVID ANAYA CASTELLAR",
        degree: "Segundo",
      },
      {
        name: "DOMINICK GRISOLLES RAMÍREZ",
        degree: "Segundo",
      },
      {
        name: "SALOMÉ OSORIO LEÓN",
        degree: "Segundo",
      },
      {
        name: "MARÍA ANDREA HERRERA BALLESTEROS",
        degree: "Segundo",
      },
      {
        name: "ELIAN DAVID SÁNCHEZ PÉREZ",
        degree: "Segundo",
      },
      {
        name: "MARÍA FERNANDA LÓPEZ CABRERA",
        degree: "Segundo",
      },
      {
        name: "SARA SOFÍA GÓMEZ OLMOS",
        degree: "Segundo",
      },
      {
        name: "SANTIAGO ARTURO RODRÍGUEZ FLÓREZ",
        degree: "Segundo",
      },
      {
        name: "NICOLÁS PÉREZ DURÁN",
        degree: "Segundo",
      },
      {
        name: "ELIF PAOLA MEZA",
        degree: "Segundo",
      },
      {
        name: "ESTEBAN DAVID PINEDA JIMÉNEZ",
        degree: "Segundo",
      },
      {
        name: "ABIGAIL MERCADO FORBES",
        degree: "Segundo",
      },
      {
        name: "YULIAM DE JESÚS GONZÁLEZ RUIZ",
        degree: "Segundo",
      },
      {
        name: "BRIANNA SIERRA MEZA",
        degree: "Segundo",
      },
      {
        name: "SANTIAGO EMILIO FERNÁNDEZ BENITOREBOLLO",
        degree: "Segundo",
      },
    ],
    tercero: [
      {
        name: "JUAN ESTEBAN OSORIO LARA",
        degree: "Tercero",
      },
      {
        name: "JESÚS ADRIÁN TAPIAS DÍAZ",
        degree: "Tercero",
      },
      {
        name: "SHAYLENE SARAY DÍAZ LUNA",
        degree: "Tercero",
      },
      {
        name: "MATHIAS ALBERTO ORTÍZ LOZANO",
        degree: "Tercero",
      },
      {
        name: "MICHELLE SARAY RUIZ NUÑEZ",
        degree: "Tercero",
      },
      {
        name: "PAULA ANTONIA GUZMÁN SALAZAR",
        degree: "Tercero",
      },
      {
        name: "MYLAN MARIMÓN RIVERA",
        degree: "Tercero",
      },
      {
        name: "AINARA PEREIRA TOSCANO",
        degree: "Tercero",
      },
      {
        name: "VICTORIA SOFÍA PUELLO ROSALES",
        degree: "Tercero",
      },
      {
        name: "YULIANIS TEHERÁN PÉREZ",
        degree: "Tercero",
      },
      {
        name: "LUIS ÁNGEL MORALES OSPINO",
        degree: "Tercero",
      },
      {
        name: "SEBASTIÁN SAID LEÓN ANAYA",
        degree: "Tercero",
      },
      {
        name: "ELIAS HERRERA JULIO",
        degree: "Tercero",
      },
      {
        name: "ESTEBAN LUIS ANGÚLO PÉREZ",
        degree: "Tercero",
      },
      {
        name: "ARIANIS SOFÍA LEONES SERPA",
        degree: "Tercero",
      },
      {
        name: "THIAGO MATHIAS BECERRA MARTÍNEZ",
        degree: "Tercero",
      },
      {
        name: "AARON DAVID ROMERO JAAMAN",
        degree: "Tercero",
      },
    ],
    cuarto: [
      {
        name: "ALDO JAVIER THERÁN CARDONA",
        degree: "Cuarto",
      },
      {
        name: "MARIANA OSUNA ARROYO",
        degree: "Cuarto",
      },
      {
        name: "AARON MIELES CANDIA",
        degree: "Cuarto",
      },
      {
        name: "MARÍA SALOMÉ ROMERO SALCEDO",
        degree: "Cuarto",
      },
      {
        name: "JERÓNIMO BARÓN MARTELO",
        degree: "Cuarto",
      },
      {
        name: "DANIEL DAVID HERRERA PRADA",
        degree: "Cuarto",
      },
      {
        name: "DILAN JOSÉ VÉLEZ PINTO",
        degree: "Cuarto",
      },
      {
        name: "SAID ANDRÉS CARRASQUILLA CONTRERAS",
        degree: "Cuarto",
      },
      {
        name: "ISAÍAS JOSÉ CASTRO TOSCANO",
        degree: "Cuarto",
      },
      {
        name: "OSCAR JOSÉ MILANO MOGOLLÓN",
        degree: "Cuarto",
      },
      {
        name: "ANILEC MELÉNDEZ MARTÍNEZ",
        degree: "Cuarto",
      },
      {
        name: "JUAN SEBASTIÁN RODRÍGUEZ FLÓREZ",
        degree: "Cuarto",
      },
      {
        name: "SANTHIAGO MIGUEL POLANCO LUNA",
        degree: "Cuarto",
      },
      {
        name: "JUAN DE DIOS DE AGUAS FUNIELES",
        degree: "Cuarto",
      },
      {
        name: "MIA AILEVE POLO BERDUGO",
        degree: "Cuarto",
      },
      {
        name: "SHARENNY CASTELLAR SÁNCHEZ",
        degree: "Cuarto",
      },
      {
        name: "SAMUEL DAVID PACHECO FLÓREZ",
        degree: "Cuarto",
      },
      {
        name: "VALERI SOFIA MANRIQUE BALTAZAR",
        degree: "Cuarto",
      },
      {
        name: "JUAN FELIPE CAICEDO CASTILLO",
        degree: "Cuarto",
      },
      {
        name: "SARA VALENTINA DE JUANA CABARCAS SOLANO",
        degree: "Cuarto",
      },
      {
        name: "ISABELLA MELENDEZ BECERRA",
        degree: "Cuarto",
      },
    ],
    quinto: [
      {
        name: "JHON SEBASTIAN ATENCIO LANG",
        degree: "Quinto",
      },
      {
        name: "JOSÉ SEBASTIÁN ACENDRA BULA",
        degree: "Quinto",
      },
      {
        name: "JHOSTYN DAVID PÉREZ CARRILLO",
        degree: "Quinto",
      },
      {
        name: "JONÁS ZÁRATE MARTÍNEZ",
        degree: "Quinto",
      },
      {
        name: "THIAGO ANDRE CASTRO GUERRA",
        degree: "Quinto",
      },
      {
        name: "GABRIEL CERPA JIMÉNEZ",
        degree: "Quinto",
      },
      {
        name: "SOFÍA IRIARTE ACOSTA",
        degree: "Quinto",
      },
      {
        name: "SARA LUZ IRIARTE ACOSTA",
        degree: "Quinto",
      },
      {
        name: "LUIS ÁNGEL MENESES MERCADO",
        degree: "Quinto",
      },
      {
        name: "DIGNA DEL CARMEN PÉREZ VALDEZ",
        degree: "Quinto",
      },
      {
        name: "YARIANA SOFÍA MORELOS BELLO",
        degree: "Quinto",
      },
      {
        name: "MARTÍN FERNANDO TORRES GONZÁLEZ",
        degree: "Quinto",
      },
      {
        name: "LHIAM JOSÉ POLO BERDUGO",
        degree: "Quinto",
      },
      {
        name: "FIORELLA RODRÍGUEZ GARCÍA",
        degree: "Quinto",
      },
      {
        name: "TALIANA SOFÍA OSORIO LEÓN",
        degree: "Quinto",
      },
      {
        name: "JULIANA ALEJANDRA DE ALBA TRUJILLO",
        degree: "Quinto",
      },
      {
        name: "ISABELLA MERCADO BANQUET",
        degree: "Quinto",
      },
      {
        name: "JUAN MANUEL JULIO POMBO",
        degree: "Quinto",
      },
      {
        name: "LUIS MARIO CASTILLO PÉREZ",
        degree: "Quinto",
      },
    ],
  },
};

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Seed periods
  console.log("Seeding periods...");
  // Delete all existing students
  console.log("Deleting existing students...");
  await prisma.studentGrade.deleteMany({});
  await prisma.studentObservation.deleteMany({});
  await prisma.student.deleteMany({});
  console.log("All students deleted successfully.");
  for (const period of dataToSeed.periods) {
    await prisma.period.upsert({
      where: {
        number_year: {
          number: period.number,
          year: period.year,
        },
      },
      update: {},
      create: {
        number: period.number,
        year: period.year,
      },
    });
  }

  // Seed degrees and their subjects
  console.log("Seeding degrees and subjects...");
  for (const degree of dataToSeed.degrees) {
    // Create the degree
    const createdDegree = await prisma.degree.upsert({
      where: { name: degree.name },
      update: {},
      create: { name: degree.name },
    });

    // If this degree has associated subjects, connect them
    if (degree.subjects) {
      const subjectList = dataToSeed.subjects[degree.subjects as string];

      for (const subject of subjectList) {
        // Create subject if it doesn't exist
        const createdSubject = await prisma.subject.upsert({
          where: { name: subject.name },
          update: {},
          create: { name: subject.name },
        });

        // Connect subject to degree
        await prisma.degree.update({
          where: { id: createdDegree.id },
          data: {
            subjects: {
              connect: { id: createdSubject.id },
            },
          },
        });
      }
    }

    // If this degree has associated students, create them
    if (degree.students) {
      const studentList = dataToSeed.students[degree.students as string];

      for (const student of studentList) {
        if (student.degree === degree.name) {
          await prisma.student.create({
            data: {
              name: student.name,
              degree: {
                connect: { id: createdDegree.id },
              },
            },
          });
        }
      }
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
