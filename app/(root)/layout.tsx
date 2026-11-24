import { Header } from "@/components/shared/header";
import { getHeaderUser } from "@/lib/auth/session";
import React from "react";
import { connection } from "next/server";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  const user = await getHeaderUser();

  return (
    <div className="relative z-0 flex min-h-screen flex-col">
      <Header user={user} />
      <main className="w-full flex-1">{children}</main>
    </div>
  );
}
