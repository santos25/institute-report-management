import { getDegrees } from "@/lib/actions/degree.actions";
import { getPeriods } from "@/lib/actions/period.actions";
import PlanillasPageClient from "./PlanillasPageClient";

export default async function PlanillasPageServer() {
  // Fetch the initial data
  const degrees = await getDegrees();
  const periods = await getPeriods();
  
  return (
    <PlanillasPageClient 
      initialDegrees={degrees}
      initialPeriods={periods}
    />
  );
} 