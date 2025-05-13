import { TableCell, TableHead, TableHeader } from "@/components/ui/table";

import { TableBody, TableRow } from "@/components/ui/table";

import { Table } from "@/components/ui/table";
import { FormattedStudentReport } from "./ReportsTable";
import { calculateFinalGrade } from "@/lib/utils";

type ReportGradesTableProps = {
  report: FormattedStudentReport;
};

// Grades table component
const ReportGradesTable: React.FC<ReportGradesTableProps> = ({ report }) => {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead className="border w-[270px] font-bold">
            ÁREAS (ASIGNATURAS)
          </TableHead>
          {report.periodNumbers.map((periodNum) => (
            <TableHead key={periodNum} className="border text-center font-bold">
              NOTA {periodNum}
              <br />
              PERIODO
            </TableHead>
          ))}
          <TableHead className="border text-center font-bold">
            NOTA
            <br />
            FINAL
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {report.subjects.map((subject) => {
          const finalGrade = calculateFinalGrade(subject, report.periodNumbers);
          return (
            <TableRow key={subject.id} className="border-b">
              <TableCell className="border align-top p-2">
                <div className="font-bold">{subject.name}</div>
                {subject.periods[report.lastPeriodNumber]?.achievements && (
                  <div className="text-xs pl-4 mt-1">
                    {subject.periods[report.lastPeriodNumber].achievements}
                  </div>
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
              <TableCell className="border text-center font-bold">
                {finalGrade}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ReportGradesTable;
