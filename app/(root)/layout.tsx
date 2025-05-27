import { Header } from "@/components/shared/header";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-[1600px] mx-auto min-h-screen flex flex-col">
      <Header />
      <main className="w-full pt-22">{children}</main>    
    </div>
  );
}
