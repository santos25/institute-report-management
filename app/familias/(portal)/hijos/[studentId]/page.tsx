import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ChildDetailView from "@/components/shared/familias/ChildDetailView";
import { requireGuardian } from "@/lib/auth/guardian-session";
import { getGuardianChildDetail } from "@/lib/guardian/load-child-detail";
import { getActiveSchoolYear } from "@/lib/school-year";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notas | Angelitos Alegres",
};

export default async function ChildDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const guardian = await requireGuardian();
  if (guardian.mustChangePassword) redirect("/familias/cambiar-clave");

  const { studentId } = await params;
  const detail = await getGuardianChildDetail({
    guardianId: guardian.id,
    studentId,
    year: getActiveSchoolYear(),
  });

  if (!detail) notFound();

  return <ChildDetailView detail={detail} />;
}
