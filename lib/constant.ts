const PREESCOLAR_LEVEL = ["Párvulo", "Prejardín", "Jardín", "Transición"];

const DOCENTES_BY_GRADE = {
  Párvulo: "KELLIS RIVERO RIVERO",
  Prejardín: "KELLIS RIVERO RIVERO",
  Jardín: "DANNA MARTÍNEZ CASTELLÓN",
  Transición: "MERLY RUIZ LOZANO",
  Primero: "ENILSA VÉLEZ ALFARO",
  Segundo: "MARIANELA CUETO DE LA ROSA",
  Tercero: "VILANIS GUERRERO AGÁMEZ",
  Cuarto: "MARIBEL JULIO CUADRO",
  Quinto: "MARÍA ELENA RAMOS ALVARADO",
};

const preescolar_subject = [
  { name: "Comunicativa", hours: 5 },
  { name: "Cognitiva", hours: 5 },
  { name: "Corporal", hours: 5 },
  { name: "Ética y Valores", hours: 3 },
  { name: "Estética", hours: 2 },
  { name: "Inglés", hours: 3 },
  { name: "Comportamiento Social", hours: 0 },
];

const transicion_subject = [
  { name: "Comunicativa", hours: 5 },
  { name: "Cognitiva", hours: 5 },
  { name: "Corporal", hours: 2 },
  { name: "Ética y Valores", hours: 3 },
  { name: "Estética", hours: 3 },
  { name: "Inglés", hours: 3 },
  { name: "Informática", hours: 5 },
  { name: "Comportamiento Social", hours: 0 },
];

const primaria_subject = [
  { name: "Lenguaje - Comprensión Lectora", hours: 5 },
  { name: "Matemáticas", hours: 5 },
  { name: "Geometría", hours: 2 },
  { name: "Ciencias Naturales", hours: 3 },
  { name: "Informática y tecnología", hours: 2 },
  { name: "Ciencias Sociales", hours: 3 },
  { name: "Idioma Extranjero: Inglés", hours: 2 },
  { name: "Educación Religiosa", hours: 2 },
  { name: "Ética y Valores", hours: 2 },
  { name: "Educación Artística", hours: 2 },
  { name: "Educación Física", hours: 2 },
  { name: "Comportamiento Social", hours: 0 },
];

const SUBJECT_HOURS_BY_GRADE = {
  Párvulo: preescolar_subject,
  Prejardín: preescolar_subject,
  Jardín: preescolar_subject,
  Transición: transicion_subject,
  Primero: primaria_subject,
  Segundo: primaria_subject,
  Tercero: primaria_subject,
  Cuarto: primaria_subject,
  Quinto: primaria_subject,
};

export { PREESCOLAR_LEVEL, DOCENTES_BY_GRADE, SUBJECT_HOURS_BY_GRADE };
