import { Award, CalendarDays, IdCard, Users } from "lucide-react";
import { SITE } from "@/lib/site";

const items = [
  { icon: Award, title: SITE.resolutionShort, detail: SITE.resolutionDate },
  { icon: IdCard, title: "DANE", detail: SITE.dane },
  {
    icon: CalendarDays,
    title: SITE.calendar,
    detail: "Calendario escolar oficial",
  },
  { icon: Users, title: "Mixto y privado", detail: "Niños y niñas juntos" },
];

export function TrustStrip() {
  return (
    <section
      aria-label="Datos oficiales"
      className="bg-azul-500 text-primary-foreground"
    >
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 px-4 pb-12 pt-6 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-card/15">
              <item.icon className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-display text-base font-semibold leading-tight sm:text-lg">
                {item.title}
              </span>
              <span className="text-sm text-azul-50">{item.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
