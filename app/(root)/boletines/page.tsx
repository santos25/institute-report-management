import { getDegrees } from "@/lib/actions/degree.actions";
import { requireUser } from "@/lib/auth/session";
import { NoAssignedDegrees } from "@/components/shared/portal/NoAssignedDegrees";
import BoletinesPageClient from "./BoletinesPageClient";

export const dynamic = "force-dynamic";

export default async function BoletinHome() {
  const user = await requireUser();
  const degrees = await getDegrees();

  if (user.role === "TEACHER" && degrees.length === 0) {
    return <NoAssignedDegrees />;
  }

  return <BoletinesPageClient initialDegrees={degrees} />;
}
