import { getDegrees } from "@/lib/actions/degree.actions";
import BoletinesPageClient from "./BoletinesPageClient";

export default async function BoletinHome() {
  const degrees = await getDegrees();

  return <BoletinesPageClient initialDegrees={degrees} />;
}
