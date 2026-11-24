import { getDegrees } from "@/lib/actions/degree.actions";
import { getPeriods } from "@/lib/actions/period.actions";
import PlanillasPageClient from "./PlanillasPageClient";

export default async function PlanillasPageServer({
  initialDegreeId = "",
  initialPeriodId = "",
}: {
  initialDegreeId?: string;
  initialPeriodId?: string;
}) {
  const degrees = await getDegrees();
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