import { TableCell, TableHead, TableHeader } from "@/components/ui/table";

import { TableBody, TableRow } from "@/components/ui/table";

import { Table } from "@/components/ui/table";
import { FormattedStudentReport } from "./ReportsTable";
import { getHourBySubjectAndDegree } from "@/lib/utils";
import { PREESCOLAR_LEVEL } from "@/lib/constant";

type ReportGradesTableProps = {
  report: FormattedStudentReport;
};

// Grades table component
const ReportGradesTable: React.FC<ReportGradesTableProps> = ({ report }) => {
  // Function to calculate average grade for a specific period
  const calculatePeriodAverage = (periodNumber: number) => {
    const validGrades = report.subjects
      .map((subject) => subject.periods[periodNumber]?.grade)
      .filter((grade) => grade !== undefined && grade !== null);

    if (validGrades.length === 0) return 0;

    const sum = validGrades.reduce((acc, grade) => acc + grade, 0);
    return sum / validGrades.length;
  };

  return (
    <Table className="border">
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead className="border text-center w-full font-bold text-sm py-1">
            {PREESCOLAR_LEVEL.includes(report?.degree?.name || "")
              ? "DIMENSIONES"
              : "ÁREAS (ASIGNATURAS)"}
          </TableHead>
          <TableHead className="border text-center font-bold text-sm py-1">
            IH
          </TableHead>
          {report.periodNumbers.map((periodNum) => (
            <TableHead
              key={periodNum}
              className="border text-center font-bold text-sm py-1"
            >
              PERIODO {periodNum}
              <br />
              NOTA
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {report.subjects.map((subject) => {
          return (
            <TableRow key={subject.id} className="border-b">
              <TableCell className="border align-top p-1 w-full">
                <div className="font-bold text-sm">{subject.name}</div>
                {subject.periods[report.lastPeriodNumber]?.achievements && (
                  <div className="text-xs pl-2 mt-0.5 whitespace-pre-wrap leading-tight">
                    {subject.periods[
                      report.lastPeriodNumber
                    ].achievements.trim()}
                  </div>
                )}
              </TableCell>
              <TableCell className="border text-center text-xs">
                {getHourBySubjectAndDegree(
                  subject.name,
                  report.degree?.name || ""
                )}
              </TableCell>
              {report.periodNumbers.map((periodNum) => (
                <TableCell
                  key={periodNum}
                  className="border text-center text-xs"
                >
                  {subject.periods[periodNum]
                    ? subject.periods[periodNum].grade.toFixed(1)
                    : "N/A"}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
        {/* Average row */}
        <TableRow className="border-b bg-gray-50">
          <TableCell
            className="border p-1 w-full font-bold text-right text-sm"
            colSpan={2}
          >
            Promedio
          </TableCell>
          {report.periodNumbers.map((periodNum) => (
            <TableCell
              key={periodNum}
              className="border text-center font-bold text-xs py-1"
            >
              {calculatePeriodAverage(periodNum).toFixed(1)}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ReportGradesTable;
