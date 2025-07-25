import ReportGradesTable from "./ReportGradesTable";
import ReportObservation from "./ReportObservation";
import { FormattedStudentReport } from "./ReportsTable";

// Main student report component
const StudentReportDetail: React.FC<{
  report: FormattedStudentReport;
}> = ({ report }) => {
  return (
    <div className="space-y-4 p-2">
      <div>
        <ReportGradesTable report={report} />
      </div>

      <ReportObservation
        observation={report.observations[report.lastPeriodNumber]}
      />
    </div>
  );
};

export default StudentReportDetail;
