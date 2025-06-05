import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentReport } from "@/lib/actions/report.actions";
import { formatStudentReport } from "@/lib/utils";
import { Degree } from "@prisma/client";
import { Printer, FileText } from "lucide-react";
import BoletinPrint from "./BoletinPrint";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

// Type definitions
export type SubjectData = {
  id: string;
  name: string;
  periods: Record<number, { grade: number; achievements: string }>;
};

export type FormattedStudentReport = {
  student: {
    id: string;
    name: string;
    degreeId: string;
  };
  degree?: Degree;
  periodNumbers: number[];
  lastPeriodNumber: number;
  subjects: SubjectData[];
  observations: Record<number, string>;
};

type ReportsTableProps = {
  degrees: Degree[];
  selectedDegree: string;
  selectedYear: string;
  studentReports: StudentReport[];
};

// Main component
export default function ReportsTable({
  degrees,
  selectedDegree,
  selectedYear,
  studentReports,
}: ReportsTableProps) {
  const boletinPrintRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: boletinPrintRef });
  const [selectedReportForPrint, setSelectedReportForPrint] =
    useState<FormattedStudentReport | null>(null);

  const degreeName = degrees.find((d) => d.id === selectedDegree)?.name;

  const handlePrintReport = (studentId: string) => {
    const reportData = studentReports.find(
      (report) => report.student.id === studentId
    );
    if (reportData) {
      const formattedReport = formatStudentReport(reportData, degrees);
      setSelectedReportForPrint(formattedReport);
      // Small delay to ensure state is updated before printing
      setTimeout(() => {
        reactToPrintFn();
      }, 100);
    }
  };

  return (
    <>
      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                Boletines de Calificaciones
              </CardTitle>
              <p className="text-sm  mt-1">
                {degreeName} - Año {selectedYear}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="">
          {studentReports.length > 0 ? (
            <div className="">
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-900">
                      <TableHead className="font-bold text-gray-700 dark:text-gray-300 p-4">
                        Estudiante
                      </TableHead>
                      <TableHead className="font-bold text-gray-700 dark:text-gray-300 p-4">
                        Periodos Registrados
                      </TableHead>
                      <TableHead className="font-bold text-gray-700 dark:text-gray-300 p-4 text-center">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentReports.map((report, index) => {
                      const periodBadges = report.periodGrades.map((p) => (
                        <Badge
                          key={p.periodNumber}
                          variant="outline"
                          className="mr-1 mb-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                        >
                          P{p.periodNumber}
                        </Badge>
                      ));

                      return (
                        <TableRow
                          key={report.student.id}
                          className="hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors border-b"
                        >
                          <TableCell className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {report.student.name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {periodBadges}
                            </div>
                          </TableCell>
                          <TableCell className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handlePrintReport(report.student.id)
                                }
                              >
                                <Printer className="h-4 w-4" />
                                Imprimir
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No hay boletines disponibles
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                No hay información de calificaciones para los estudiantes en
                este grado y año académico.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden print component */}
      <div style={{ display: "none" }}>
        <BoletinPrint
          printRef={boletinPrintRef as React.RefObject<HTMLDivElement>}
          report={selectedReportForPrint}
          year={selectedYear}
        />
      </div>
    </>
  );
}
