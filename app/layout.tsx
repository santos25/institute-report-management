import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SITE } from "@/lib/site";

import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Instituto Angelitos Alegres | Preescolar y Primaria en Nuevo Bosque, Cartagena",
  description:
    "Formando el futuro de nuestros niños y niñas con amor, dedicación y excelencia educativa. Preescolar y Básica Primaria en Nuevo Bosque, Cartagena.",
  openGraph: {
    title: SITE.name,
    description: SITE.tagline,
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${nunito.variable} ${fredoka.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
