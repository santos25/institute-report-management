import Image from "next/image";
import { cn } from "@/lib/utils";
import { features, toneClasses } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function WhyAngelitos() {
  return (
    <section
      id="nosotros"
      className="bg-sol-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-[58%_42%_46%_54%/48%_44%_56%_52%] shadow-xl ring-8 ring-card">
            <Image
              src="/images/img5.jpg"
              alt="Estudiantes compartiendo al aire libre"
              fill
              sizes="(max-width: 1024px) 90vw, 448px"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-4 right-4 max-w-[15rem] rounded-3xl bg-card p-5 shadow-xl sm:right-10">
            <p className="font-display text-lg font-semibold leading-snug text-tinta">
              “Cada niño y niña se siente valorado y protegido.”
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-coral-700">
              Nuestro compromiso
            </p>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <SectionHeading
              eyebrow="Por qué elegirnos"
              title="Educación que abraza, inspira y acompaña"
              align="left"
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 80}>
                <article className="h-full rounded-3xl bg-card p-6 shadow-sm ring-1 ring-sol-200">
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl",
                      toneClasses[feature.tone].icon
                    )}
                  >
                    <feature.icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-tinta">
                    {feature.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-tinta-600">
                    {feature.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
