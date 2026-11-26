import { getWhatsAppUrl, SITE } from "@/lib/site";
import { WhatsAppIcon } from "./whatsapp-icon";

export function MobileWhatsAppBar() {
  return (
    <div
      data-fixed-bar
      className="fixed inset-x-0 bottom-0 z-40 border-t border-crema-300 bg-card/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_-15px_rgb(36_48_74/0.35)] backdrop-blur md:hidden"
    >
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-full bg-whatsapp py-2 pl-2 pr-5 text-whatsapp-foreground shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card/35">
          <WhatsAppIcon className="size-5" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block font-display text-base font-semibold">
            Agenda una visita
          </span>
          <span className="block text-xs font-bold">
            WhatsApp {SITE.whatsappDisplay}
          </span>
        </span>
        <span className="text-sm font-extrabold">Escribir</span>
      </a>
    </div>
  );
}
