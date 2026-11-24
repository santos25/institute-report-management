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
import { boletinDownloadTitle, formatStudentReport } from "@/lib/utils";
import { Degree } from "@prisma/client";
import { Printer, FileText, Download, Loader2 } from "lucide-react";
import BoletinPrint from "./BoletinPrint";
import BulkBoletinPrint from "./BulkBoletinPrint";
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
  const bulkBoletinPrintRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: boletinPrintRef });
  const [selectedReportForPrint, setSelectedReportForPrint] =
    useState<FormattedStudentReport | null>(null);
  const [bulkPrintReports, setBulkPrintReports] = useState<
    FormattedStudentReport[]
  >([]);
  const [isBulkPrinting, setIsBulkPrinting] = useState(false);

  const degreeName = degrees.find((d) => d.id === selectedDegree)?.name;

  const bulkDocumentTitle = boletinDownloadTitle(degreeName, selectedYear);

  const reactToPrintBulkFn = useReactToPrint({
    contentRef: bulkBoletinPrintRef,
    documentTitle: bulkDocumentTitle,
    onAfterPrint: () => setIsBulkPrinting(false),
    onPrintError: () => {
      setIsBulkPrinting(false);
      alert("No se pudo preparar la impresión de los boletines.");
    },
  });

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

  const handlePrintAllReports = () => {
    if (studentReports.length === 0) {
      alert("Este grado no tiene boletines para el año seleccionado.");
      return;
    }

    setIsBulkPrinting(true);

    const formattedReports = studentReports.map((report) =>
      formatStudentReport(report, degrees)
    );

    setBulkPrintReports(formattedReports);

    // Espera a que el mismo boletín individual quede en el DOM antes de imprimir.
    window.setTimeout(() => {
      reactToPrintBulkFn();
    }, 150);
  };

  return (
    <>
      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-azul-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-azul-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-foreground">
                  Boletines de Calificaciones
                </CardTitle>
                <p className="text-sm  mt-1">
                  {degreeName} - Año {selectedYear}
                </p>
              </div>
            </div>
            {studentReports.length > 0 && (
              <Button
                onClick={handlePrintAllReports}
                disabled={isBulkPrinting}
                aria-busy={isBulkPrinting}
                className="w-full sm:w-auto bg-success text-success-foreground hover:bg-success/90"
                size="default"
              >
                {isBulkPrinting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isBulkPrinting ? "Preparando..." : "Imprimir todos"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="">
          {studentReports.length > 0 ? (
            <div className="">
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="font-bold text-foreground p-4">
                        Estudiante
                      </TableHead>
                      <TableHead className="font-bold text-foreground p-4">
                        Periodos Registrados
                      </TableHead>
                      <TableHead className="font-bold text-foreground p-4 text-center">
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
                          className="mr-1 mb-1 bg-hoja-50 text-hoja-800 border-hoja-200"
                        >
                          P{p.periodNumber}
                        </Badge>
                      ));

                      return (
                        <TableRow
                          key={report.student.id}
                          className="hover:bg-azul-50 transition-colors border-b"
                        >
                          <TableCell className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-azul-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="font-bold text-azul-700 text-sm">
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
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
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No hay boletines disponibles
              </h3>
              <p className="text-muted-foreground max-w-md">
                No hay información de calificaciones para los estudiantes en
                este grado y año académico.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden print components */}
      <div style={{ display: "none" }}>
        <BoletinPrint
          printRef={boletinPrintRef as React.RefObject<HTMLDivElement>}
          report={selectedReportForPrint}
          year={selectedYear}
        />
      </div>

      <div style={{ display: "none" }}>
        <BulkBoletinPrint
          printRef={bulkBoletinPrintRef as React.RefObject<HTMLDivElement>}
          reports={bulkPrintReports}
          year={selectedYear}
        />
      </div>
    </>
  );
}
