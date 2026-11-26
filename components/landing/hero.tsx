import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl, SITE } from "@/lib/site";
import { Sun } from "./sun";
import { WhatsAppIcon } from "./whatsapp-icon";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-sol-300/45 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-48 size-64 rounded-full bg-coral-300/40 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:pb-28 lg:pt-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-[13px] font-bold text-tinta shadow-sm ring-1 ring-crema-300">
            <span className="size-2 rounded-full bg-coral-500" />
            Preescolar y Básica Primaria · {SITE.city}
          </p>
          <h1 className="mt-6 text-balance font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-tinta sm:text-6xl lg:text-[4.1rem]">
            Aquí aprender se siente{" "}
            <span className="relative inline-block whitespace-nowrap text-azul-500">
              como en casa
              <svg
                aria-hidden
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1.5 left-0 h-[0.32em] w-full text-sol-500"
              >
                <path
                  d="M2 8 C 20 2, 30 12, 50 6 S 85 2, 118 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-tinta-600 sm:text-xl">
            En el {SITE.name} acompañamos a niños y niñas desde los 2 años hasta
            quinto de primaria, con amor, paciencia y una formación integral que
            los prepara para la vida.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="h-14 rounded-full bg-whatsapp px-7 text-base font-extrabold text-whatsapp-foreground shadow-[0_12px_28px_-10px_rgb(37_211_102/0.9)] hover:bg-whatsapp/90 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
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
              className="h-14 rounded-full border-2 border-azul-200 bg-card px-7 text-base font-extrabold text-azul-600 hover:border-azul-300 hover:bg-azul-50 hover:text-azul-700"
              asChild
            >
              <Link href="#niveles">
                Conoce los niveles
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-9 flex items-center gap-3 text-sm font-semibold text-tinta-600">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-hoja-100 text-hoja-800">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <p>
              Aprobado por {SITE.resolutionShort} de 2020
              <span className="hidden sm:inline"> · </span>
              <br className="sm:hidden" />
              DANE {SITE.dane}
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
          <Sun className="absolute -left-6 -top-8 z-20 size-24 sm:size-28" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem_2rem_3.5rem_2.25rem] bg-azul-100 shadow-[0_30px_60px_-25px_rgb(36_48_74/0.45)] ring-8 ring-card">
            <Image
              src="/images/img1.jpg"
              alt="Niños y niñas construyendo con bloques en el aula"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-cover"
            />
          </div>
          <figure className="absolute -bottom-10 -left-3 w-[46%] -rotate-6 rounded-2xl bg-card p-2 pb-3 shadow-xl sm:-left-10">
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/images/img6.jpg"
                alt="Niñas con flores de papel en una actividad de arte"
                fill
                sizes="(max-width: 1024px) 40vw, 20vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-center font-display text-sm font-semibold text-tinta-600">
              Arte y creatividad
            </figcaption>
          </figure>
          <div className="absolute -right-2 bottom-16 rotate-[5deg] rounded-[1.4rem] bg-sol-400 px-5 py-4 text-center font-display shadow-lg sm:-right-6">
            <p className="text-3xl font-semibold leading-none text-tinta">
              2 años
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-tinta-700">
              hasta 5° grado
            </p>
          </div>
        </div>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block h-12 w-full text-azul-500 sm:h-16"
      >
        <path
          fill="currentColor"
          d="M0 40c120-30 240-30 360 0s240 30 360 0 240-30 360 0 240 30 360 0v40H0z"
        />
      </svg>
    </section>
  );
}
