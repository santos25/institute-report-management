import { Button } from "@/components/ui/button";
import { getWhatsAppUrl } from "@/lib/site";
import { Reveal } from "./reveal";
import { WhatsAppIcon } from "./whatsapp-icon";

export function Admissions() {
  return (
    <section
      id="admisiones"
      className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-azul-600">
            Admisiones
          </p>
          <h2 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
            Cómo inscribirse
          </h2>
          <Button
            className="mt-8 h-12 rounded-full bg-whatsapp px-6 text-base text-whatsapp-foreground hover:bg-whatsapp/90"
            asChild
          >
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              Preguntar por inscripción
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
