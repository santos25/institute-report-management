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
      <div className="font-bold mb-1">OBSERVACIONES:</div>
      <div className="border p-3 text-sm whitespace-pre-wrap">
        {observation}
      </div>
    </div>
  );
};

export default ReportObservation;
