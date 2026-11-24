import PlanillasPageServer from "./PlanillasPageServer";

export const dynamic = "force-dynamic";

type PlanillasPageProps = {
  searchParams: Promise<{ grado?: string | string[]; periodo?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function PlanillasPage({ searchParams }: PlanillasPageProps) {
  const params = await searchParams;

  return (
    <PlanillasPageServer
      initialDegreeId={firstParam(params.grado)}
      initialPeriodId={firstParam(params.periodo)}
    />
  );
}
