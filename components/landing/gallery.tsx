"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { galleryImages } from "./content";
import { Reveal } from "./reveal";

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
        (currentIndex + direction + galleryImages.length) %
        galleryImages.length
    );
  };

  return (
    <section
      id="galeria"
      className="scroll-mt-24 bg-lila-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-lila-700">
              Galería
            </p>
            <h2 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
              Nuestros angelitos
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-tinta-600">
              Una mirada a la vida en el jardín. Toca una foto para verla en
              grande.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-3">
              {galleryImages.map((image, i) => (
                <CarouselItem
                  key={image.src}
                  className="pl-3 sm:basis-1/2 lg:basis-1/3"
                >
                  <button
                    type="button"
                    onClick={() => openAt(i)}
                    className="group relative block w-full overflow-hidden rounded-[1.75rem] text-left shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:transition-transform motion-safe:hover:-translate-y-1"
                  >
                    <span className="relative block aspect-square">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                        className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
                      />
                    </span>
                    <span className="absolute left-3 top-3 rounded-full bg-crema/95 px-3 py-1 text-xs font-semibold text-tinta">
                      {image.category}
                    </span>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 border-0 bg-card/90 text-tinta shadow-md sm:-left-4" />
            <CarouselNext className="right-2 border-0 bg-card/90 text-tinta shadow-md sm:-right-4" />
          </Carousel>
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
