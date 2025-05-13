// Student details card component

import { FormattedStudentReport } from "./ReportsTable";

// Props type definitions
type StudentReportCardProps = {
  student: FormattedStudentReport["student"];
};

const StudentReportCard: React.FC<StudentReportCardProps> = ({ student }) => {
  return (
    <div className="flex items-center gap-2 p-3 border rounded-md bg-slate-50">
      <div>
        <h3 className="font-semibold">{student.name}</h3>
      </div>
    </div>
  );
};

export default StudentReportCard;
