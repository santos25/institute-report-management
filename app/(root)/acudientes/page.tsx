import type { Metadata } from "next";
import { getGuardiansPageData } from "@/lib/actions/guardian.actions";
import { requireAdminPage } from "@/lib/auth/session";
import AcudientesManager from "./AcudientesManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acudientes | Angelitos Alegres",
};

export default async function AcudientesPage() {
  await requireAdminPage();
  const { guardians, students } = await getGuardiansPageData();
  return <AcudientesManager guardians={guardians} students={students} />;
}
