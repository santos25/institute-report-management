import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  preschoolGrades,
  primaryFocus,
  primaryGrades,
  toneClasses,
} from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const cardClass =
  "h-full overflow-hidden rounded-[2.25rem] bg-card shadow-[0_20px_50px_-30px_rgb(36_48_74/0.5)] ring-1 ring-crema-300";

export function Levels() {
  return (
    <section id="niveles" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Nuestros niveles"
            tone="coral"
            title="Un camino feliz, de los primeros pasos a quinto grado"
            description="Acompañamos cada etapa con el cariño y la atención que tu hijo o hija necesita para crecer seguro."
          />
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <article className={cardClass}>
              <div className="relative h-64 sm:h-72">
                <Image
                  src="/images/img4.jpg"
                  alt="Niños y niñas de preescolar coloreando en clase"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[50%_35%]"
                />
                <span className="absolute left-5 top-5 rounded-full bg-coral-500 px-4 py-1.5 font-display text-sm font-semibold text-tinta shadow">
                  Preescolar
                </span>
              </div>
              <div className="p-7 sm:p-9">
                <h3 className="font-display text-3xl font-semibold text-tinta">
                  Aprender jugando
                </h3>
                <p className="mt-3 leading-relaxed text-tinta-600">
                  Motricidad, socialización, exploración y los primeros
                  acercamientos a letras y números, en un ambiente seguro y
                  lleno de afecto.
                </p>
                <ul className="mt-6 grid grid-cols-2 gap-3">
                  {preschoolGrades.map((grade) => (
                    <li
                      key={grade.name}
                      className={cn(
                        "rounded-2xl px-4 py-3",
                        toneClasses[grade.tone].soft
                      )}
                    >
                      <span className="block font-display text-lg font-semibold text-tinta">
                        {grade.name}
                      </span>
                      <span className="text-sm font-semibold text-tinta-600">
                        {grade.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>

          <Reveal delay={90}>
            <article className={cardClass}>
              <div className="relative h-64 sm:h-72">
                <Image
                  src="/images/img3.jpg"
                  alt="Estudiantes de primaria con banderas en una actividad del colegio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[50%_40%]"
                />
                <span className="absolute left-5 top-5 rounded-full bg-azul-500 px-4 py-1.5 font-display text-sm font-semibold text-primary-foreground shadow">
                  Básica Primaria
                </span>
              </div>
              <div className="p-7 sm:p-9">
                <h3 className="font-display text-3xl font-semibold text-tinta">
                  Bases para la vida
                </h3>
                <p className="mt-3 leading-relaxed text-tinta-600">
                  De primero a quinto grado acompañamos a cada estudiante de
                  cerca, fortaleciendo hábitos de estudio, autonomía y valores.
                </p>
                <ul
                  className="mt-6 flex flex-wrap gap-2 sm:gap-3"
                  aria-label="Grados de primaria"
                >
                  {primaryGrades.map((grade) => (
                    <li
                      key={grade}
                      className="flex size-12 items-center justify-center rounded-2xl bg-azul-50 font-display text-xl font-semibold text-azul-600 sm:size-16 sm:text-2xl"
                    >
                      {grade}
                    </li>
                  ))}
                </ul>
                <ul className="mt-6 flex flex-wrap gap-2 text-sm font-bold text-tinta-600">
                  {primaryFocus.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-crema-200 px-3.5 py-1.5"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
