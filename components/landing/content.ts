import { Heart, BookOpen, Palette, Users } from "lucide-react";

export const features = [
  {
    icon: Heart,
    title: "Ambiente Cálido",
    description:
      "Un entorno seguro y amoroso donde cada niño y niña se siente valorado y protegido.",
    tone: "coral" as const,
  },
  {
    icon: BookOpen,
    title: "Educación Integral",
    description:
      "Desarrollo cognitivo, emocional y social a través de metodologías innovadoras.",
    tone: "azul" as const,
  },
  {
    icon: Palette,
    title: "Arte y Creatividad",
    description:
      "Fomentamos la expresión artística y la creatividad en distintas formas.",
    tone: "lila" as const,
  },
  {
    icon: Users,
    title: "Clases personalizadas",
    description:
      "Atención personalizada con grupos reducidos para ayudar al aprendizaje.",
    tone: "hoja" as const,
  },
];

export const programs = [
  {
    image: "/images/img1.jpg",
    title: "Párvulo",
    age: "2-3 años",
    description:
      "Una suave introducción al mundo escolar, enfocada en la socialización y el desarrollo de la motricidad.",
    features: ["Juego libre", "Motricidad", "Socialización", "Rutinas básicas"],
    tone: "coral" as const,
  },
  {
    image: "/images/img2.jpg",
    title: "Pre Jardín",
    age: "3-4 años",
    description:
      "Fomentamos la curiosidad a través de actividades de exploración y conceptos básicos.",
    features: ["Exploración", "Pre-lectura", "Números básicos", "Arte"],
    tone: "azul" as const,
  },
  {
    image: "/images/img3.jpg",
    title: "Jardín",
    age: "4-5 años",
    description:
      "Preparamos a los niños para la etapa escolar con un programa estructurado y divertido.",
    features: ["Lectoescritura", "Matemáticas", "Ciencias", "Preparación escolar"],
    tone: "lila" as const,
  },
];

export const galleryImages = [
  {
    src: "/images/img1.jpg",
    alt: "Niños y niñas construyendo con bloques en el aula",
    category: "Aprendizaje",
  },
  {
    src: "/images/img4.jpg",
    alt: "Niños aprendiendo en clase",
    category: "Aprendizaje",
  },
  {
    src: "/images/img6.jpg",
    alt: "Niñas con flores de papel en una actividad de arte",
    category: "Arte",
  },
  {
    src: "/images/img5.jpg",
    alt: "Actividades al aire libre",
    category: "Recreación",
  },
  {
    src: "/images/img7.jpg",
    alt: "Estudiantes juntos en una salida por Cartagena",
    category: "Socialización",
  },
  {
    src: "/images/img2.jpg",
    alt: "Encuentro de estudiantes en el patio del instituto",
    category: "Comunidad",
  },
  {
    src: "/images/img3.jpg",
    alt: "Niños y niñas en una actividad grupal",
    category: "Socialización",
  },
];

export const dayMoments = [
  {
    src: "/images/img4.jpg",
    alt: "Niños aprendiendo en clase",
    category: "Aprendizaje",
  },
  {
    src: "/images/img6.jpg",
    alt: "Niñas con flores de papel en una actividad de arte",
    category: "Arte",
  },
  {
    src: "/images/img5.jpg",
    alt: "Actividades al aire libre",
    category: "Recreación",
  },
  {
    src: "/images/img7.jpg",
    alt: "Estudiantes juntos en una salida por Cartagena",
    category: "Socialización",
  },
];

export const toneClasses = {
  coral: {
    icon: "bg-coral-100 text-coral-700",
    badge: "bg-coral-100 text-tinta",
    bar: "bg-coral-500",
  },
  azul: {
    icon: "bg-azul-100 text-azul-700",
    badge: "bg-azul-100 text-azul-800",
    bar: "bg-azul-500",
  },
  lila: {
    icon: "bg-lila-100 text-lila-700",
    badge: "bg-lila-100 text-lila-800",
    bar: "bg-lila-500",
  },
  hoja: {
    icon: "bg-hoja-100 text-hoja-800",
    badge: "bg-hoja-100 text-hoja-800",
    bar: "bg-hoja-500",
  },
  sol: {
    icon: "bg-sol-100 text-sol-800",
    badge: "bg-sol-100 text-tinta",
    bar: "bg-sol-500",
  },
};
