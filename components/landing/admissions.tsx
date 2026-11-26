import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/site";
import { admissionSteps, toneClasses } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { WhatsAppIcon } from "./whatsapp-icon";

export function Admissions() {
  return (
    <section
      id="admision"
      className="bg-azul-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Proceso de admisión"
            title="Cuatro pasos sencillos para ser parte de la familia"
            description="Te acompañamos personalmente por WhatsApp en cada paso, desde el primer mensaje hasta la matrícula."
          />
        </Reveal>

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {admissionSteps.map((step, index) => (
            <li key={step.title}>
              <Reveal
                delay={index * 80}
                className="h-full rounded-[2rem] bg-card p-7 shadow-sm ring-1 ring-azul-100"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl",
                      toneClasses[step.tone].icon
                    )}
                  >
                    <step.icon className="size-6" aria-hidden />
                  </span>
                  <span
                    aria-hidden
                    className="font-display text-5xl font-semibold leading-none text-azul-200"
                  >
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-tinta">
                  <span className="sr-only">Paso {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-tinta-600">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-10 flex justify-center">
          <Button
            size="lg"
            className="h-14 rounded-full bg-whatsapp px-7 text-base font-extrabold text-whatsapp-foreground shadow-md hover:bg-whatsapp/90 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
            asChild
          >
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              Agenda una visita
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
