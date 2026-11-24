"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl, SITE } from "@/lib/site";
import { WhatsAppIcon } from "@/components/landing/whatsapp-icon";
import { logout } from "@/lib/auth/actions";
import { roleLabel, type HeaderUser } from "@/lib/auth/roles";

const LANDING_NAV = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Grados", href: "#grados" },
  { label: "Un día con nosotros", href: "#un-dia" },
  { label: "Galería", href: "#galeria" },
  { label: "Admisiones", href: "#admisiones" },
  { label: "Contacto", href: "#contacto" },
];

export const Header = ({ user = null }: { user?: HeaderUser | null }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resolveHref = (href: string) => (isLanding ? href : `/${href}`);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!isLanding || !href.startsWith("#")) return;
    event.preventDefault();
    const target = document.getElementById(href.slice(1));
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/70 bg-crema/95 backdrop-blur-md transition-shadow",
        isScrolled && "shadow-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            priority
            src="/logo.png"
            alt=""
            width={48}
            height={48}
            className="size-10 rounded-full bg-white object-contain p-0.5 shadow-sm sm:size-12"
          />
          <span className="truncate font-display text-sm font-semibold leading-tight text-tinta sm:text-base">
            Angelitos Alegres
          </span>
        </Link>

        {isLanding ? (
          <nav
            className="hidden items-center gap-0.5 xl:flex"
            aria-label="Secciones"
          >
            {LANDING_NAV.map((item) => (
              <Link
                key={item.href}
                href={resolveHref(item.href)}
                onClick={(event) => handleNavClick(event, item.href)}
                className="rounded-full px-3 py-2 text-sm font-medium text-tinta-600 motion-safe:transition-colors hover:bg-azul-50 hover:text-azul-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="hidden items-center gap-2 md:flex" aria-label="Portal">
            <Link
              href="/"
              className="rounded-full px-3 py-2 text-sm text-tinta-600 hover:text-azul-700"
            >
              Inicio
            </Link>
            <Link
              href="/planillas"
              className={cn(
                "rounded-full px-3 py-2 text-sm",
                pathname.startsWith("/planillas")
                  ? "bg-azul-50 font-medium text-azul-700"
                  : "text-tinta-600 hover:text-azul-700"
              )}
            >
              Planillas
            </Link>
            <Link
              href="/boletines"
              className={cn(
                "rounded-full px-3 py-2 text-sm",
                pathname.startsWith("/boletines")
                  ? "bg-azul-50 font-medium text-azul-700"
                  : "text-tinta-600 hover:text-azul-700"
              )}
            >
              Boletines
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                href="/usuarios"
                className={cn(
                  "rounded-full px-3 py-2 text-sm",
                  pathname.startsWith("/usuarios")
                    ? "bg-azul-50 font-medium text-azul-700"
                    : "text-tinta-600 hover:text-azul-700"
                )}
              >
                Usuarios
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {isLanding ? (
            <>
              <Link
                href="/planillas"
                className="hidden text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline xl:inline"
              >
                Portal docentes
              </Link>
              <Button
                size="sm"
                className="hidden h-9 rounded-full bg-whatsapp px-3 text-whatsapp-foreground hover:bg-whatsapp/90 md:inline-flex"
                asChild
              >
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </a>
              </Button>
            </>
          ) : user ? (
            <div className="hidden items-center gap-3 md:flex">
              <div className="text-right leading-tight">
                <p className="max-w-40 truncate text-sm font-semibold text-tinta">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {roleLabel(user.role)}
                </p>
              </div>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Cerrar sesión
                </Button>
              </form>
            </div>
          ) : null}

          <div className={cn(isLanding ? "xl:hidden" : "md:hidden")}>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  aria-label="Abrir menú"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-crema p-6">
                <SheetTitle className="font-display text-tinta">
                  {SITE.name}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Navegación del sitio
                </SheetDescription>
                <nav className="mt-8 flex flex-col gap-1">
                  {isLanding ? (
                    LANDING_NAV.map((item) => (
                      <Link
                        key={item.href}
                        href={resolveHref(item.href)}
                        onClick={(event) => handleNavClick(event, item.href)}
                        className="rounded-xl px-3 py-3 text-base font-medium text-tinta hover:bg-azul-50"
                      >
                        {item.label}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-3 py-3 text-base text-tinta hover:bg-azul-50"
                      >
                        Inicio
                      </Link>
                      <Link
                        href="/planillas"
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-3 py-3 text-base text-tinta hover:bg-azul-50"
                      >
                        Planillas
                      </Link>
                      <Link
                        href="/boletines"
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-3 py-3 text-base text-tinta hover:bg-azul-50"
                      >
                        Boletines
                      </Link>
                      {user?.role === "ADMIN" && (
                        <Link
                          href="/usuarios"
                          onClick={() => setOpen(false)}
                          className="rounded-xl px-3 py-3 text-base text-tinta hover:bg-azul-50"
                        >
                          Usuarios
                        </Link>
                      )}
                    </>
                  )}
                </nav>
                {!isLanding && user && (
                  <div className="mt-8 space-y-3 border-t border-border pt-6">
                    <p className="px-3 text-sm font-semibold text-tinta">
                      {user.name}
                    </p>
                    <p className="px-3 text-sm text-muted-foreground">
                      {roleLabel(user.role)}
                    </p>
                    <form action={logout}>
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full rounded-full"
                      >
                        Cerrar sesión
                      </Button>
                    </form>
                  </div>
                )}
                {isLanding && (
                  <div className="mt-8 space-y-3 border-t border-border pt-6">
                    <Button
                      className="w-full rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
                      asChild
                    >
                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsAppIcon />
                        WhatsApp
                      </a>
                    </Button>
                    <Link
                      href="/planillas"
                      onClick={() => setOpen(false)}
                      className="block text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Portal docentes
                    </Link>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
