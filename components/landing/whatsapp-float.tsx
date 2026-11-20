import { getWhatsAppUrl } from "@/lib/site";
import { WhatsAppIcon } from "./whatsapp-icon";

// TODO: El propietario debe confirmar que +57 300 2850238 es un número de WhatsApp.
export function WhatsAppFloat() {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-xl motion-safe:transition-transform motion-safe:hover:scale-105 motion-safe:active:scale-95 md:hidden"
      aria-label="Escríbenos por WhatsApp"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
