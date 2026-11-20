import { Award, Clock, MapPin, Users } from "lucide-react";
import { SITE } from "@/lib/site";
import { Reveal } from "./reveal";

const items = [
  {
    icon: Award,
    label: SITE.resolution,
  },
  {
    icon: MapPin,
    label: `${SITE.neighborhood}, ${SITE.city}`,
  },
  {
    icon: Clock,
    label: SITE.hoursWeekday,
  },
  {
    icon: Users,
    label: "Grupos reducidos",
  },
];

export function TrustStrip() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <Reveal>
        <ul className="mx-auto grid max-w-6xl gap-3 rounded-[2rem] bg-azul-600 px-4 py-5 text-white sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.label} className="flex items-start gap-3 p-2">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                <item.icon className="size-4" aria-hidden />
              </span>
              <span className="text-sm font-medium leading-snug">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
