import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Download, Printer } from "lucide-react";
import StudentReportCard from "./StudentReportCard";
import StudentReportDetail from "./StudentReportDetail";
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
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  const degreeName = degrees.find((d) => d.id === selectedDegree)?.name;

  const handlePrintReport = () => {
    reactToPrintFn();
  };

  const handleViewReport = (studentId: string) => {
    console.log("studentReports: ", studentReports);

    const reportData = studentReports.find(
      (report) => report.student.id === studentId
    );
    if (reportData) {
      const formattedReport = formatStudentReport(reportData, degrees);
      setSelectedReportForPrint(formattedReport);
      setSelectedStudentId(studentId);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Estudiantes: {degreeName} - Año {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {studentReports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Periodos Registrados</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentReports.map((report) => {
                  const periodText = report.periodGrades
                    .map((p) => `Periodo ${p.periodNumber}`)
                    .join(", ");

                  return (
                    <TableRow key={report.student.id}>
                      <TableCell>
                        <StudentReportCard student={report.student} />
                      </TableCell>
                      <TableCell>{periodText}</TableCell>
                      <TableCell>
                        <Dialog
                          onOpenChange={(open) => {
                            if (open) {
                              handleViewReport(report.student.id);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Ver Boletín
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>
                                Boletín de {report.student.name} -{" "}
                                {selectedYear}
                              </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-[80vh]">
                              {selectedStudentId === report.student.id &&
                                selectedReportForPrint && (
                                  <StudentReportDetail
                                    report={selectedReportForPrint}
                                  />
                                )}
                            </ScrollArea>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrintReport}
                                className="gap-2"
                              >
                                <Printer className="h-4 w-4" />
                                Imprimir
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => console.log("downloading...")}
                                className="gap-2"
                              >
                                <Download className="h-4 w-4" />
                                Descargar PDF
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No hay información de calificaciones para los estudiantes en
                este año.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <BoletinPrint
        printRef={boletinPrintRef as React.RefObject<HTMLDivElement>}
        report={selectedReportForPrint}
        year={selectedYear}
      />
    </>
  );
}
