import { getDegrees } from "@/lib/actions/degree.actions";
import { getPeriods } from "@/lib/actions/period.actions";
import { requireUser } from "@/lib/auth/session";
import { NoAssignedDegrees } from "@/components/shared/portal/NoAssignedDegrees";
import PlanillasPageClient from "./PlanillasPageClient";

export default async function PlanillasPageServer({
  initialDegreeId = "",
  initialPeriodId = "",
}: {
  initialDegreeId?: string;
  initialPeriodId?: string;
}) {
  const user = await requireUser();
  const degrees = await getDegrees();

  if (user.role === "TEACHER" && degrees.length === 0) {
    return <NoAssignedDegrees />;
  }

  const periods = await getPeriods();
  const degreeId = degrees.some((degree) => degree.id === initialDegreeId)
    ? initialDegreeId
    : "";
  const periodId = periods.some((period) => period.id === initialPeriodId)
    ? initialPeriodId
    : "";

  return (
    <PlanillasPageClient
      key={`${degreeId}:${periodId}`}
      initialDegrees={degrees}
      initialPeriods={periods}
      initialDegreeId={degreeId}
      initialPeriodId={periodId}
    />
  );
}
