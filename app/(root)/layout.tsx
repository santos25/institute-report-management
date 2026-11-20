import { Header } from "@/components/shared/header";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative z-0 flex min-h-screen flex-col">
      <Header />
      <main className="w-full flex-1">{children}</main>
    </div>
  );
}
