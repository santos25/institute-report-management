import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/portal/sidebar";
import { PortalTopBar } from "@/components/portal/top-bar";
import { SessionGuard } from "@/components/auth/SessionGuard";
import { SignOutGuard } from "@/components/planillas/SignOutGuard";

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F7F7FB]">
      <SessionGuard />
      <SignOutGuard />
      <PortalSidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalTopBar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
