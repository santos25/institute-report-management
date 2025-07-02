// Observation component
type ReportObservationProps = {
  observation: string;
};

const ReportObservation: React.FC<ReportObservationProps> = ({
  observation,
}) => {
  if (!observation) return null;

  return (
    <div className="mt-4">
      <div className="font-bold mb-1 text-sm">OBSERVACIONES:</div>
      <div className="underline p-1 text-xs whitespace-pre-wrap leading-tight">
        {observation}
      </div>
    </div>
  );
};

export default ReportObservation;
