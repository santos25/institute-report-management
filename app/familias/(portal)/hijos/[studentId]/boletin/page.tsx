import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FamilyBoletin from "@/components/shared/familias/FamilyBoletin";
import { requireGuardian } from "@/lib/auth/guardian-session";
import { childDetailToReport } from "@/lib/guardian/child-detail";
import { getGuardianChildDetail } from "@/lib/guardian/load-child-detail";
import { getActiveSchoolYear } from "@/lib/school-year";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Boletín | Angelitos Alegres",
};

export default async function FamilyBoletinPage({
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
    access: "boletin",
  });
  if (!detail) notFound();

  if (detail.periods.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <h1 className="font-display text-2xl font-semibold text-tinta">Boletín</h1>
        <p className="mt-2 text-sm text-tinta">
          El boletín aparece cuando el colegio publica un periodo de este año.
        </p>
        <Link
          href={`/familias/hijos/${detail.student.id}`}
          className="mt-6 inline-block text-sm font-semibold text-azul-700 underline-offset-4 hover:underline"
        >
          Volver a las notas
        </Link>
      </div>
    );
  }

  return (
    <FamilyBoletin
      reportData={childDetailToReport(detail)}
      degreeId={detail.student.degreeId}
      degreeName={detail.student.degreeName}
      year={String(detail.year)}
      backHref={`/familias/hijos/${detail.student.id}`}
    />
  );
}
