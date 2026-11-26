import Link from "next/link";
import { ArrowRight, GraduationCap, House } from "lucide-react";
import { SITE } from "@/lib/site";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function CommunityAccess() {
  return (
    <section id="familias" className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Comunidad Angelitos"
            title="Accesos para familias y docentes"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <Link
              href={SITE.familiesPortalPath}
              className="group flex h-full flex-col rounded-[2rem] bg-azul-500 p-8 text-primary-foreground shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-sol-400 motion-safe:transition-transform motion-safe:hover:-translate-y-1 sm:p-10"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-card/15">
                <House className="size-7" aria-hidden />
              </span>
              <span className="mt-6 font-display text-3xl font-semibold">
                Portal familias
              </span>
              <span className="mt-2 max-w-sm leading-relaxed text-azul-50">
                Consulta los boletines y sigue de cerca el proceso de tus hijos
                desde casa.
              </span>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 font-extrabold">
                Ingresar
                <ArrowRight
                  className="size-5 motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </Link>
          </Reveal>
          <Reveal delay={90}>
            <Link
              href={SITE.teachersLoginPath}
              className="group flex h-full flex-col rounded-[2rem] bg-card p-8 text-tinta shadow-sm ring-2 ring-lila-200 outline-none focus-visible:ring-4 focus-visible:ring-ring motion-safe:transition-transform motion-safe:hover:-translate-y-1 sm:p-10"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-lila-100 text-lila-700">
                <GraduationCap className="size-7" aria-hidden />
              </span>
              <span className="mt-6 font-display text-3xl font-semibold">
                Ingreso docentes
              </span>
              <span className="mt-2 max-w-sm leading-relaxed text-tinta-600">
                Acceso para nuestro equipo docente: planillas, boletines y
                seguimiento académico.
              </span>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 font-extrabold text-lila-700">
                Ingresar
                <ArrowRight
                  className="size-5 motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
