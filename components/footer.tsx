import Link from "next/link";
import { SITE } from "@/lib/site";

const LINKS = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Grados", href: "#grados" },
  { label: "Un día con nosotros", href: "#un-dia" },
  { label: "Galería", href: "#galeria" },
  { label: "Admisiones", href: "#admisiones" },
  { label: "Contacto", href: "#contacto" },
];

export const Footer = () => {
  return (
    <footer className="bg-tinta-800 text-crema-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="md:col-span-1">
          <h2 className="font-display text-xl font-semibold">{SITE.name}</h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-tinta-300">
            {SITE.tagline}
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-sol-400">
            Enlaces
          </h3>
          <ul className="mt-4 space-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-tinta-300 hover:text-crema-100 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-sol-400">
            Horarios
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-tinta-300">
            <li>{SITE.hoursWeekday}</li>
            <li>{SITE.hoursSaturday}</li>
            <li>{SITE.hoursSunday}</li>
          </ul>
          <p className="mt-4 text-sm text-tinta-300">{SITE.addressFull}</p>
          <p className="mt-1 text-sm">
            <a
              href={`tel:${SITE.phoneTel}`}
              className="hover:text-crema-100 hover:underline"
            >
              {SITE.phoneDisplay}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-crema-100 hover:underline"
            >
              {SITE.email}
            </a>
          </p>
          {/* TODO: Añadir Instagram y Facebook cuando el propietario confirme las URLs oficiales. */}
        </div>
      </div>
      <div className="border-t border-tinta-600 py-6 text-center text-sm text-tinta-400">
        © {new Date().getFullYear()} {SITE.name}. Todos los derechos
        reservados.
      </div>
    </footer>
  );
};
