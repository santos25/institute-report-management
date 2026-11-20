import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl } from "@/lib/site";
import { enrollmentSteps, faqs } from "./content";
import { Reveal } from "./reveal";
import { WhatsAppIcon } from "./whatsapp-icon";

export function Admissions() {
  return (
    <section
      id="admisiones"
      className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-azul-600">
            Admisiones
          </p>
          <h2 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
            Cómo inscribirse
          </h2>
          <p className="mt-3 text-tinta-600">
            {/* TODO: El propietario debe confirmar y redactar el proceso real. */}
            Los pasos siguientes son un esquema provisional. El instituto
            completará el proceso oficial de matrícula.
          </p>

          <ol className="mt-8 space-y-4">
            {enrollmentSteps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-dashed border-coral-400 bg-coral-50 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-coral-700">
                  Paso {index + 1} · Por completar
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-tinta">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-tinta-600">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <Button
            className="mt-6 h-11 rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
            asChild
          >
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Preguntar por inscripción
            </a>
          </Button>
        </Reveal>

        <Reveal delay={80}>
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-lila-600">
            Preguntas frecuentes
          </p>
          <h2 className="font-display text-3xl font-semibold text-tinta">
            Resolvemos tus dudas
          </h2>
          <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card px-4 sm:px-6">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-medium text-tinta marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-2">
                    {faq.placeholder && (
                      <span className="mt-0.5 shrink-0 rounded-full bg-sol-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-tinta">
                        Por completar
                      </span>
                    )}
                    {faq.question}
                  </span>
                  <ChevronDown
                    className="size-5 shrink-0 text-tinta-500 motion-safe:transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p
                  className={`mt-3 text-sm leading-relaxed text-tinta-600 ${
                    faq.placeholder ? "italic" : ""
                  }`}
                >
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
