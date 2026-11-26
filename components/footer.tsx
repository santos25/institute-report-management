import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl, SITE } from "@/lib/site";
import { WhatsAppIcon } from "@/components/landing/whatsapp-icon";

const SECTION_LINKS = [
  { label: "Niveles", href: "#niveles" },
  { label: "Por qué elegirnos", href: "#nosotros" },
  { label: "Galería", href: "#galeria" },
  { label: "Admisión", href: "#admision" },
  { label: "Preguntas frecuentes", href: "#preguntas" },
  { label: "Ubicación", href: "#ubicacion" },
];

const ACCESS_LINKS = [
  { label: "Portal familias", href: SITE.familiesPortalPath },
  { label: "Ingreso docentes", href: SITE.teachersLoginPath },
];

const headingClass =
  "font-display text-sm font-semibold uppercase tracking-wider text-sol-400";
const linkClass = "text-sm text-tinta-200 hover:text-crema-100 hover:underline";

export const Footer = () => {
  return (
    <footer className="bg-tinta-800 pb-28 text-crema-100 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={48}
              height={48}
              className="size-12 rounded-full bg-card object-contain p-0.5"
            />
            <h2 className="font-display text-xl font-semibold">{SITE.name}</h2>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-tinta-200">
            {SITE.tagline}.
          </p>
          <p className="mt-4 text-sm text-tinta-200">
            {SITE.resolution} · DANE {SITE.dane}
          </p>
        </div>
        <div>
          <h3 className={headingClass}>Secciones</h3>
          <ul className="mt-4 space-y-2">
            {SECTION_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={headingClass}>Accesos</h3>
          <ul className="mt-4 space-y-2">
            {ACCESS_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-tinta-200">
            Preescolar y Básica Primaria
            <br />
            {SITE.calendar} · Mixto y privado
          </p>
        </div>
        <div>
          <h3 className={headingClass}>Contacto</h3>
          <p className="mt-4 text-sm leading-relaxed text-tinta-200">
            {SITE.address}
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-crema-100 hover:underline"
          >
            <WhatsAppIcon className="size-4 text-whatsapp" />
            {SITE.whatsappDisplay}
          </a>
        </div>
      </div>
      <div className="border-t border-tinta-600 px-4 py-6 text-center text-sm text-tinta-300">
        © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
};
