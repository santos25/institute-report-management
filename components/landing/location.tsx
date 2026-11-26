import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getDirectionsUrl,
  getMapEmbedUrl,
  getWhatsAppUrl,
  SITE,
} from "@/lib/site";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { WhatsAppIcon } from "./whatsapp-icon";

export function Location() {
  return (
    <section
      id="ubicacion"
      className="bg-coral-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Ubicación"
            tone="coral"
            title={`Te esperamos en ${SITE.neighborhood}`}
            align="left"
          />
          <ul className="mt-8 space-y-5">
            <li className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-coral-100 text-coral-700">
                <MapPin className="size-6" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold text-tinta">
                  Dirección
                </span>
                <span className="text-tinta-600">{SITE.address}</span>
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-hoja-100 text-hoja-800">
                <WhatsAppIcon className="size-6" />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold text-tinta">
                  WhatsApp
                </span>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-azul-600 underline-offset-4 hover:underline"
                >
                  {SITE.whatsappDisplay}
                </a>
              </span>
            </li>
          </ul>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-13 rounded-full bg-whatsapp px-6 text-base font-extrabold text-whatsapp-foreground hover:bg-whatsapp/90"
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
            <Button
              size="lg"
              variant="outline"
              className="h-13 rounded-full border-2 border-coral-200 bg-card px-6 text-base font-extrabold text-tinta hover:bg-coral-100"
              asChild
            >
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation />
                Cómo llegar
              </a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="overflow-hidden rounded-[2.25rem] bg-card p-2 shadow-xl ring-1 ring-coral-100">
            <iframe
              title={`Mapa de ubicación del ${SITE.name}`}
              src={getMapEmbedUrl()}
              loading="lazy"
              className="block h-80 w-full rounded-[1.9rem] border-0 sm:h-[26rem]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
