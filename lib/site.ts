/**
 * Datos institucionales confirmados por el colegio. No inventar hechos nuevos
 * aquí (precios, testimonios, horarios, premios…) sin confirmación.
 */
export const SITE = {
  name: "Instituto Angelitos Alegres",
  tagline:
    "Formando el futuro de nuestros niños y niñas con amor, dedicación y excelencia educativa",
  city: "Cartagena",
  neighborhood: "Nuevo Bosque",
  address: "Nuevo Bosque, Transv. 51, Calle 4 N° 29B-77, Cartagena",
  coordinates: { lat: 10.39033, lng: -75.50493 },
  whatsappDisplay: "+57 301 2294350",
  whatsappNumber: "573012294350",
  resolution: "Resolución #2815 del 4 de junio de 2020",
  resolutionShort: "Resolución #2815",
  resolutionDate: "4 de junio de 2020",
  dane: "313001000185",
  calendar: "Calendario A",
  familiesPortalPath: "/familias/login",
  teachersLoginPath: "/login",
} as const;

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola, me gustaría agendar una visita al Instituto Angelitos Alegres.";

export function getWhatsAppUrl(message: string = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getDirectionsUrl() {
  const { lat, lng } = SITE.coordinates;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function getMapEmbedUrl() {
  const { lat, lng } = SITE.coordinates;
  const bbox = [lng - 0.004, lat - 0.003, lng + 0.004, lat + 0.003]
    .map((n) => n.toFixed(4))
    .join(",");
  const params = new URLSearchParams({
    bbox,
    layer: "mapnik",
    marker: `${lat},${lng}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}
