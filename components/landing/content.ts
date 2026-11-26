import {
  BookOpen,
  CalendarCheck,
  FileCheck,
  Heart,
  MessageCircle,
  Palette,
  School,
  UserRound,
} from "lucide-react";
import { SITE } from "@/lib/site";

export type Tone = "azul" | "sol" | "coral" | "lila" | "hoja";

export const features = [
  {
    icon: Heart,
    title: "Ambiente cálido",
    description:
      "Un entorno seguro y amoroso donde cada estudiante se siente en confianza.",
    tone: "coral" as const,
  },
  {
    icon: BookOpen,
    title: "Educación integral",
    description: "Desarrollo cognitivo, emocional y social en cada etapa.",
    tone: "azul" as const,
  },
  {
    icon: Palette,
    title: "Arte y creatividad",
    description:
      "Fomentamos la expresión artística y la imaginación en distintas formas.",
    tone: "lila" as const,
  },
  {
    icon: UserRound,
    title: "Atención personalizada",
    description: "Acompañamos el ritmo y las fortalezas de cada niño y niña.",
    tone: "hoja" as const,
  },
];

export const preschoolGrades = [
  { name: "Párvulo", detail: "2 a 3 años", tone: "coral" as const },
  { name: "Prejardín", detail: "3 a 4 años", tone: "sol" as const },
  { name: "Jardín", detail: "4 a 5 años", tone: "lila" as const },
  { name: "Transición", detail: "Paso a la primaria", tone: "hoja" as const },
];

export const primaryGrades = ["1°", "2°", "3°", "4°", "5°"];

export const primaryFocus = [
  "Hábitos de estudio",
  "Autonomía",
  "Valores",
  SITE.calendar,
];

export const galleryImages = [
  {
    src: "/images/img6.jpg",
    alt: "Niñas con flores de papel en una actividad de arte",
    category: "Arte",
    className: "col-span-2 row-span-2",
    position: "object-center",
  },
  {
    src: "/images/img7.jpg",
    alt: "Estudiantes juntos en una salida por Cartagena",
    category: "Salidas",
    className: "row-span-2",
    position: "object-[50%_60%]",
  },
  {
    src: "/images/img4.jpg",
    alt: "Niños y niñas coloreando en clase",
    category: "Aprendizaje",
    className: "",
    position: "object-center",
  },
  {
    src: "/images/img5.jpg",
    alt: "Estudiantes compartiendo al aire libre",
    category: "Recreación",
    className: "",
    position: "object-center",
  },
  {
    src: "/images/img2.jpg",
    alt: "Encuentro de estudiantes en el patio del instituto",
    category: "Comunidad",
    className: "col-span-2",
    position: "object-center",
  },
  {
    src: "/images/img1.jpg",
    alt: "Niños y niñas construyendo con bloques en el aula",
    category: "En el aula",
    className: "col-span-2",
    position: "object-[50%_65%]",
  },
];

export const admissionSteps = [
  {
    icon: MessageCircle,
    title: "Escríbenos",
    description:
      "Envíanos un mensaje por WhatsApp con la edad de tu hijo o hija y el grado de interés.",
    tone: "coral" as const,
  },
  {
    icon: CalendarCheck,
    title: "Agenda tu visita",
    description:
      "Acordamos contigo el día y la hora que mejor te funcionen para conocernos.",
    tone: "sol" as const,
  },
  {
    icon: School,
    title: "Conoce el colegio",
    description:
      "Recorre las instalaciones, conoce a nuestro equipo y resuelve todas tus dudas.",
    tone: "lila" as const,
  },
  {
    icon: FileCheck,
    title: "Formaliza la matrícula",
    description:
      "Te indicamos por WhatsApp los requisitos y documentos para completar el proceso.",
    tone: "azul" as const,
  },
];

export const faqs = [
  {
    question: "¿Desde qué edad pueden ingresar?",
    answer:
      "Desde Párvulo, para niños y niñas de 2 a 3 años. Luego continúan en Prejardín (3 a 4 años), Jardín (4 a 5 años) y Transición.",
  },
  {
    question: "¿Qué grados ofrecen?",
    answer:
      "Preescolar (Párvulo, Prejardín, Jardín y Transición) y Básica Primaria de primero a quinto grado. Somos un colegio mixto y privado de Calendario A.",
  },
  {
    question: "¿El colegio está aprobado oficialmente?",
    answer: `Sí. Estamos aprobados por la ${SITE.resolution}, con código DANE ${SITE.dane}.`,
  },
  {
    question: "¿Cómo agendo una visita?",
    answer: `Escríbenos por WhatsApp al ${SITE.whatsappDisplay} y acordamos contigo el día y la hora para que vengas a conocer el colegio.`,
  },
  {
    question: "¿Dónde están ubicados?",
    answer: `En el barrio ${SITE.neighborhood}: ${SITE.address}.`,
  },
  {
    question: "¿Cómo consulto los costos y requisitos de matrícula?",
    answer:
      "Escríbenos por WhatsApp y te compartimos los valores actualizados y los documentos necesarios para la matrícula.",
  },
];

export const toneClasses: Record<
  Tone,
  { icon: string; soft: string; solid: string }
> = {
  coral: {
    icon: "bg-coral-100 text-coral-700",
    soft: "bg-coral-50",
    solid: "bg-coral-500 text-tinta",
  },
  azul: {
    icon: "bg-azul-100 text-azul-700",
    soft: "bg-azul-50",
    solid: "bg-azul-500 text-primary-foreground",
  },
  lila: {
    icon: "bg-lila-100 text-lila-700",
    soft: "bg-lila-50",
    solid: "bg-lila-500 text-primary-foreground",
  },
  hoja: {
    icon: "bg-hoja-100 text-hoja-800",
    soft: "bg-hoja-50",
    solid: "bg-hoja-500 text-tinta",
  },
  sol: {
    icon: "bg-sol-100 text-sol-800",
    soft: "bg-sol-50",
    solid: "bg-sol-500 text-tinta",
  },
};
