import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl, SITE } from "@/lib/site";
import { WhatsAppIcon } from "./whatsapp-icon";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-8 size-48 rounded-full bg-sol-300/50 blur-3xl motion-safe:animate-float"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-32 size-40 rounded-full bg-coral-300/40 blur-3xl motion-safe:animate-float-delayed"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-1/3 size-32 rounded-full bg-lila-300/30 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-sol-100 px-3 py-1 text-sm font-semibold text-tinta">
            Preescolar · {SITE.neighborhood}, {SITE.city}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-tinta sm:text-5xl lg:text-6xl">
            Instituto
            <span className="block text-azul-600">Angelitos Alegres</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-tinta-600 sm:text-xl">
            {SITE.tagline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="h-12 rounded-full bg-whatsapp px-6 text-base text-whatsapp-foreground shadow-md hover:bg-whatsapp/90 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
              asChild
            >
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                Escríbenos por WhatsApp
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-azul-300 bg-card px-6 text-base text-azul-700 hover:bg-azul-50 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
              asChild
            >
              <Link href="#grados">Conoce nuestros grados</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden
            className="absolute -bottom-4 -left-4 size-24 rounded-full bg-hoja-300/70 motion-safe:animate-float"
          />
          <div
            aria-hidden
            className="absolute -right-3 -top-3 size-16 rounded-full bg-lila-400/80"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem_2rem_3.5rem_2.25rem] bg-azul-100 shadow-xl sm:aspect-[5/6]">
            <div className="absolute inset-0 z-10 bg-tinta/15" />
            <Image
              src="/images/img1.jpg"
              alt="Niños y niñas del Instituto Angelitos Alegres en el aula"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
