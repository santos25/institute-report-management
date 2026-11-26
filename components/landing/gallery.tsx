"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { galleryImages } from "./content";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Gallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const current = galleryImages[index];

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const go = (direction: -1 | 1) => {
    setIndex(
      (currentIndex) =>
        (currentIndex + direction + galleryImages.length) % galleryImages.length
    );
  };

  return (
    <section id="galeria" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Galería"
            tone="lila"
            title="Así se vive un día con nosotros"
            align="left"
          />
          <p className="max-w-sm text-lg leading-relaxed text-tinta-600">
            Risas, descubrimientos y momentos que compartimos con nuestras
            familias. Toca una foto para verla en grande.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <ul className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-4 lg:grid-cols-4">
            {galleryImages.map((image, i) => (
              <li key={image.src} className={image.className}>
                <button
                  type="button"
                  onClick={() => openAt(i)}
                  className="group relative block size-full overflow-hidden rounded-[2rem] text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className={cn(
                      "object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105",
                      image.position
                    )}
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-card/95 px-3 py-1 font-display text-xs font-semibold text-tinta shadow sm:bottom-4 sm:left-4 sm:px-4 sm:py-1.5 sm:text-sm">
                    {image.category}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(100%-1.5rem,56rem)] overflow-hidden rounded-3xl border-0 p-0 sm:max-w-4xl [&>button]:right-3 [&>button]:top-3 [&>button]:z-10 [&>button]:size-9 [&>button]:rounded-full [&>button]:bg-crema [&>button]:text-tinta [&>button]:opacity-100">
          <DialogTitle className="sr-only">{current.alt}</DialogTitle>
          <DialogDescription className="sr-only">
            {current.category}. Usa las flechas para ver más fotos.
          </DialogDescription>
          <div className="relative aspect-[4/3] bg-tinta-900">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute left-3 top-1/2 size-10 -translate-y-1/2 rounded-full"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute right-3 top-1/2 size-10 -translate-y-1/2 rounded-full"
              onClick={() => go(1)}
              aria-label="Foto siguiente"
            >
              <ChevronRight />
            </Button>
          </div>
          <p className="bg-card px-5 py-4 text-sm text-tinta-600">
            <span className="font-display font-semibold text-tinta">
              {current.category}.
            </span>{" "}
            {current.alt}
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
