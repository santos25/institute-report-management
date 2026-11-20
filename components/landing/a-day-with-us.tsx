import Image from "next/image";
import { dayMoments } from "./content";
import { Reveal } from "./reveal";

export function ADayWithUs() {
  return (
    <section
      id="un-dia"
      className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-coral-700">
              Un día con nosotros
            </p>
            <h2 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
              Momentos de cada día
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-tinta-600">
              Cada día está lleno de descubrimientos, risas y momentos mágicos
              que capturamos para compartir con las familias.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {dayMoments.map((moment, index) => (
            <Reveal key={moment.src} delay={index * 70}>
              <figure
                className={`relative overflow-hidden rounded-[2rem] ${
                  index % 2 === 0 ? "sm:rotate-[-1deg]" : "sm:rotate-[1deg]"
                }`}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={moment.src}
                    alt={moment.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <figcaption className="absolute bottom-4 left-4 rounded-full bg-crema/95 px-4 py-1.5 font-display text-sm font-semibold text-tinta shadow-sm">
                    {moment.category}
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
