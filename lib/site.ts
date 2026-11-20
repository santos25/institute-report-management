/**
 * Datos de contacto e institución que ya existen en el sitio o en el código
 * (boletines / landing anterior). No inventar hechos nuevos aquí.
 */
export const SITE = {
  name: "Instituto Angelitos Alegres",
  tagline:
    "Formando el futuro de nuestros niños y niñas con amor, dedicación y excelencia educativa",
  city: "Cartagena, Colombia",
  neighborhood: "Nuevo Bosque",
  addressShort: "Nuevo Bosque, Transversal 51, Cartagena, Colombia",
  addressFull: "Nuevo Bosque Trv. 51 N° 29 B 77, Cartagena, Colombia",
  email: "angelitosalegres@hotmail.com",
  phoneDisplay: "+57 301 2294350",
  phoneTel: "+573012294350",
  whatsappNumber: "573012294350",
  hoursWeekday: "Lun - Vie: 7:00 AM - 5:00 PM",
  hoursSaturday: "Sábados: 8:00 AM - 12:00 PM",
  hoursSunday: "Domingos: Cerrado",
  resolution: "Aprobado por Resolución #2815 del 4 de junio de 2020",
  dane: "313001000185",
} as const;

export function getWhatsAppUrl(message?: string) {
  const text =
    message ??
    "Hola, me gustaría obtener información sobre el Instituto Angelitos Alegres.";
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function getMailtoUrl(subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${SITE.email}${query ? `?${query}` : ""}`;
}
