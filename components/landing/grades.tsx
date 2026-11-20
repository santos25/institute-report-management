import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { programs, toneClasses } from "./content";
import { Reveal } from "./reveal";

export function Grades() {
  return (
    <section
      id="grados"
      className="scroll-mt-24 bg-crema-200/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-lila-600">
              Grados
            </p>
            <h2 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
              Grados diseñados para crecer
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-tinta-600">
              Cada grado tiene su propio programa especializado para maximizar
              el potencial de aprendizaje de nuestros niños y niñas.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {programs.map((program, index) => {
            const tone = toneClasses[program.tone];
            return (
              <Reveal key={program.title} delay={index * 90}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm motion-safe:transition-all motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg">
                  <div className="relative h-56 overflow-hidden bg-azul-100">
                    <Image
                      src={program.image}
                      alt={`Grado ${program.title}, ${program.age}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
                    />
                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-semibold shadow-sm ${tone.badge}`}
                    >
                      {program.age}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-2xl font-semibold text-tinta">
                      {program.title}
                    </h3>
                    <p className="mt-3 flex-1 leading-relaxed text-tinta-600">
                      {program.description}
                    </p>
                    <ul className="mt-5 space-y-2">
                      {program.features.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-tinta-600"
                        >
                          <CheckCircle
                            className="size-4 shrink-0 text-hoja-700"
                            aria-hidden
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
