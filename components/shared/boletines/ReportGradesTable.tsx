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
      .map(subject => subject.periods[periodNumber]?.grade)
      .filter(grade => grade !== undefined && grade !== null);
    
    if (validGrades.length === 0) return 0;
    
    const sum = validGrades.reduce((acc, grade) => acc + grade, 0);
    return sum / validGrades.length;
  };

  return (
    <Table className="border">
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead className="border text-center w-full font-bold">
            {PREESCOLAR_LEVEL.includes(report?.degree?.name || "")
              ? "DIMENSIONES"
              : "ÁREAS (ASIGNATURAS)"}
          </TableHead>
          <TableHead className="border text-center font-bold">IH</TableHead>
          {report.periodNumbers.map((periodNum) => (
            <TableHead key={periodNum} className="border text-center font-bold">
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
              <TableCell className="border align-top p-2 w-full">
                <div className="font-bold">{subject.name}</div>
                {subject.periods[report.lastPeriodNumber]?.achievements && (
                  <div className="text-xs pl-4 mt-1 whitespace-pre-wrap">
                    {subject.periods[report.lastPeriodNumber].achievements}
                  </div>
                )}
              </TableCell>
              <TableCell className="border text-center font-bold">
                {getHourBySubjectAndDegree(
                  subject.name,
                  report.degree?.name || ""
                )}
              </TableCell>
              {report.periodNumbers.map((periodNum) => (
                <TableCell
                  key={periodNum}
                  className="border text-center font-bold"
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
          <TableCell className="border p-2 w-full font-bold text-right" colSpan={2}>
            Promedio
          </TableCell>
          {report.periodNumbers.map((periodNum) => (
            <TableCell
              key={periodNum}
              className="border text-center font-bold"
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
