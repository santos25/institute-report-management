import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { ContactForm } from "./contact-form";
import { Reveal } from "./reveal";

const details = [
  { icon: MapPin, label: SITE.addressFull },
  { icon: Phone, label: SITE.phoneDisplay, href: `tel:${SITE.phoneTel}` },
  { icon: Mail, label: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Clock, label: SITE.hoursWeekday },
];

export function Contact() {
  return (
    <section
      id="contacto"
      className="scroll-mt-24 bg-azul-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-azul-600">
            Contacto
          </p>
          <h2 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
            Estamos para ayudarte
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-tinta-600">
            Escríbenos para más información o para iniciar el proceso de
            inscripción. El formulario abre WhatsApp o tu correo con el mensaje
            listo.
          </p>
          <ul className="mt-8 space-y-4">
            {details.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-azul-100 text-azul-700">
                  <item.icon className="size-5" aria-hidden />
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="pt-2 text-tinta hover:text-azul-700 hover:underline"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="pt-2 text-tinta">{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={80}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
