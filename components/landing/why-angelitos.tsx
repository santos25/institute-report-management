import { features, toneClasses } from "./content";
import { Reveal } from "./reveal";

export function WhyAngelitos() {
  return (
    <section
      id="nosotros"
      className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-azul-600">
              Por qué Angelitos
            </p>
            <h2 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
              Educación que transforma
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-tinta-600">
              Creamos experiencias de aprendizaje únicas que inspiran a nuestros
              niños y niñas a explorar, crear y crecer en un ambiente lleno de
              amor y dedicación.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const tone = toneClasses[feature.tone];
            return (
              <Reveal key={feature.title} delay={index * 80}>
                <article className="group h-full rounded-[1.75rem] border border-border bg-card p-6 shadow-sm motion-safe:transition-all motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg">
                  <div
                    className={`mb-5 flex size-14 items-center justify-center rounded-2xl ${tone.icon} motion-safe:transition-transform motion-safe:group-hover:rotate-3`}
                  >
                    <Icon className="size-7" aria-hidden />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-tinta">
                    {feature.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-tinta-600">
                    {feature.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
