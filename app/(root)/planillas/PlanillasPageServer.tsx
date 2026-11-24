import { getDegrees } from "@/lib/actions/degree.actions";
import { getPeriods } from "@/lib/actions/period.actions";
import { requireUser } from "@/lib/auth/session";
import { NoAssignedDegrees } from "@/components/shared/portal/NoAssignedDegrees";
import PlanillasPageClient from "./PlanillasPageClient";

export default async function PlanillasPageServer() {
  const user = await requireUser();
  const degrees = await getDegrees();

  if (user.role === "TEACHER" && degrees.length === 0) {
    return <NoAssignedDegrees />;
  }

  const periods = await getPeriods();

  return (
    <PlanillasPageClient
      initialDegrees={degrees}
      initialPeriods={periods}
    />
  );
} 