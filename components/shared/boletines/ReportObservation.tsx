// Observation component
type ReportObservationProps = {
  observation: string;
};

const ReportObservation: React.FC<ReportObservationProps> = ({
  observation,
}) => {
  if (!observation) return null;

  return (
    <div className="mt-6">
      <div className="font-bold">OBSERVACIONES:</div>
      <div className="underline p-1 text-sm whitespace-pre-wrap">
        {observation}
      </div>
    </div>
  );
};

export default ReportObservation;
