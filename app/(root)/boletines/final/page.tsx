import { getAnnualSchoolYears } from "@/lib/actions/annual-report.actions";
import { getDegrees } from "@/lib/actions/degree.actions";
import BoletinFinalPageClient from "./BoletinFinalPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Boletín final del año | Instituto Angelitos Alegres",
};

export default async function BoletinFinalPage() {
  const [degrees, years] = await Promise.all([
    getDegrees(),
    getAnnualSchoolYears(),
  ]);

  return (
    <BoletinFinalPageClient
      degrees={degrees}
      years={years.map((year) => ({ id: String(year), year }))}
    />
  );
}
