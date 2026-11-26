import { Button } from "@/components/ui/button";
import { getWhatsAppUrl, SITE } from "@/lib/site";
import { Reveal } from "./reveal";
import { Sun } from "./sun";
import { WhatsAppIcon } from "./whatsapp-icon";

export function FinalCta() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-sol-400 px-6 py-14 text-center shadow-[0_30px_60px_-30px_rgb(166_125_20/0.8)] sm:px-12 sm:py-16">
        <Sun className="absolute -right-6 -top-6 size-32 text-sol-200 opacity-70" />
        <div
          aria-hidden
          className="absolute -bottom-16 -left-10 size-48 rounded-full bg-coral-300/50"
        />
        <div className="relative">
          <h2 className="text-balance font-display text-4xl font-semibold leading-tight text-tinta sm:text-5xl">
            ¿Te gustaría conocernos?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-tinta-700">
            Escríbenos por WhatsApp y agenda una visita. Será un gusto mostrarte
            el lugar donde tu hijo o hija crecerá feliz.
          </p>
          <Button
            size="lg"
            className="mt-8 h-14 rounded-full bg-tinta px-8 text-base font-extrabold text-primary-foreground hover:bg-tinta-800"
            asChild
          >
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              Escribir al {SITE.whatsappDisplay}
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
