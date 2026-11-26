import { Plus } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/site";
import { faqs } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { WhatsAppIcon } from "./whatsapp-icon";

export function Faq() {
  return (
    <section id="preguntas" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Preguntas frecuentes"
            tone="coral"
            title="Resolvemos tus dudas"
            description="Si no encuentras lo que buscas, escríbenos por WhatsApp y con gusto te respondemos."
            align="left"
          />
          <a
            href={getWhatsAppUrl(
              "Hola, tengo una pregunta sobre el Instituto Angelitos Alegres."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full font-extrabold text-azul-600 underline-offset-4 hover:text-azul-700 hover:underline"
          >
            <WhatsAppIcon className="size-5" />
            Hacer otra pregunta
          </a>
        </Reveal>

        <Reveal className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0}
              className="group rounded-3xl bg-card shadow-sm ring-1 ring-crema-300 open:ring-coral-200"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-6 py-5 font-display text-lg font-semibold text-tinta outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-coral-100 text-coral-700 motion-safe:transition-transform group-open:rotate-45">
                  <Plus className="size-5" aria-hidden />
                </span>
              </summary>
              <p className="px-6 pb-6 leading-relaxed text-tinta-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
