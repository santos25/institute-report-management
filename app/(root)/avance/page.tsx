import type { Metadata } from "next";
import PeriodProgressBoard from "@/components/shared/avance/PeriodProgressBoard";
import { requireUser } from "@/lib/auth/session";
import { getPeriodProgress } from "@/lib/progress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Avance del periodo | Instituto Angelitos Alegres",
};

type AvancePageProps = {
  searchParams: Promise<{ periodo?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AvancePage({ searchParams }: AvancePageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const progress = await getPeriodProgress(firstParam(params.periodo));

  return (
    <PeriodProgressBoard progress={progress} canPublish={user.role === "ADMIN"} />
  );
}
