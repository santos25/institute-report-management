"use client";

import { useRef, useState } from "react";
import { Degree } from "@prisma/client";
import { Download, Eye, FileText, Loader2, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BoletinesModeNav from "@/components/shared/boletines/BoletinesModeNav";
import BoletinFinalPrint from "@/components/shared/boletines/BoletinFinalPrint";
import BulkBoletinFinalPrint from "@/components/shared/boletines/BulkBoletinFinalPrint";
import ReportSelection from "@/components/shared/boletines/ReportSelection";
import { getAnnualDegreeReport } from "@/lib/actions/annual-report.actions";
import {
  AnnualDegreeReport,
  AnnualPeriodCoverage,
  AnnualStatus,
  annualStatusClass,
  formatGrade,
} from "@/lib/annual-report";
import { boletinFinalDownloadTitle, cn } from "@/lib/utils";

interface BoletinFinalPageClientProps {
  degrees: Degree[];
  years: { id: string; year: number }[];
}

function coverageClass(coverage: AnnualPeriodCoverage) {
  if (coverage.totalSubjects === 0 || coverage.gradedSubjects === 0) {
    return "text-muted-foreground";
  }
  if (coverage.gradedSubjects === coverage.totalSubjects) {
    return "font-semibold text-hoja-800";
  }
  return "font-semibold text-tinta";
}

function statusCounts(report: AnnualDegreeReport) {
  return report.students.reduce(
    (counts, student) => {
      counts[student.status] += 1;
      return counts;
    },
    { aprobado: 0, pendiente: 0, en_riesgo: 0 } as Record<AnnualStatus, number>
  );
}

export default function BoletinFinalPageClient({
  degrees,
  years,
}: BoletinFinalPageClientProps) {
  const [degreeId, setDegreeId] = useState("");
  const [year, setYear] = useState(years[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnnualDegreeReport | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [printStudentId, setPrintStudentId] = useState<string | null>(null);
  const [bulkStudents, setBulkStudents] = useState<AnnualDegreeReport["students"]>(
    []
  );
  const [isBulkPrinting, setIsBulkPrinting] = useState(false);

  const detailPrintRef = useRef<HTMLDivElement>(null);
  const singlePrintRef = useRef<HTMLDivElement>(null);
  const bulkPrintRef = useRef<HTMLDivElement>(null);

  const degreeName =
    report?.degree.name ?? degrees.find((degree) => degree.id === degreeId)?.name;
  const documentTitle = boletinFinalDownloadTitle(degreeName, year);

  const printDetail = useReactToPrint({
    contentRef: detailPrintRef,
    documentTitle,
  });
  const printSingle = useReactToPrint({
    contentRef: singlePrintRef,
    documentTitle,
  });
  const printBulk = useReactToPrint({
    contentRef: bulkPrintRef,
    documentTitle,
    onAfterPrint: () => setIsBulkPrinting(false),
    onPrintError: () => {
      setIsBulkPrinting(false);
      toast.error("No se pudo preparar la impresión de los boletines finales.");
    },
  });

  const handleDegreeChange = (value: string) => {
    setDegreeId(value);
    setReport(null);
    setSelectedStudentId(null);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    setReport(null);
    setSelectedStudentId(null);
  };

  const handleSearch = async () => {
    if (!degreeId || !year) return;
    setLoading(true);
    setSelectedStudentId(null);
    try {
      const nextReport = await getAnnualDegreeReport(degreeId, year);
      setReport(nextReport);
    } catch (error) {
      console.error("Error fetching annual reports:", error);
      toast.error(
        "No se pudo armar el consolidado: " + (error as Error).message
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrintOne = (studentId: string) => {
    setPrintStudentId(studentId);
    window.setTimeout(() => {
      printSingle();
    }, 150);
  };

  const handlePrintAll = () => {
    if (!report || report.students.length === 0) {
      toast.error("Este grado no tiene estudiantes para el boletín final.");
      return;
    }
    setIsBulkPrinting(true);
    setBulkStudents(report.students);
    window.setTimeout(() => {
      printBulk();
    }, 150);
  };

  const selectedBulletin = report?.students.find(
    (student) => student.student.id === selectedStudentId
  );
  const hiddenBulletin = report?.students.find(
    (student) => student.student.id === printStudentId
  );
  const counts = report ? statusCounts(report) : null;

  return (
    <div className="container mx-auto max-w-6xl px-3 py-2">
      <BoletinesModeNav current="final" className="mb-1.5" />

      {selectedBulletin && report ? (
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedStudentId(null)}
            >
              Volver al consolidado
            </Button>
            <p className="text-sm text-muted-foreground">
              {report.degree.name} · {report.year}
            </p>
            <Button onClick={() => printDetail()}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
          <BoletinFinalPrint
            printRef={detailPrintRef}
            bulletin={selectedBulletin}
            year={String(report.year)}
            degreeName={report.degree.name}
            className="rounded-lg border border-border shadow-sm"
          />
        </div>
      ) : (
        <>
          <h1 className="font-display text-xl font-bold text-foreground">
            Boletín final del año
          </h1>
          <p className="mt-0.5 mb-1.5 text-sm text-muted-foreground">
            Consolidado de P1 a P4. La definitiva es el promedio de los
            periodos con nota, a un decimal.
          </p>

          <ReportSelection
            degrees={degrees}
            years={years}
            selectedDegree={degreeId}
            selectedYear={year}
            onDegreeChange={handleDegreeChange}
            onYearChange={handleYearChange}
            onSearch={handleSearch}
            loading={loading}
            actionLabel="Ver consolidado"
            className="mb-1.5 gap-2 py-3"
          />

          {years.length === 0 && (
            <p className="mb-4 text-sm text-muted-foreground">
              No hay años lectivos registrados en los periodos.
            </p>
          )}

          {report && (
            <Card className="gap-1.5 border py-2 shadow-sm">
              <CardHeader className="px-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-azul-100">
                      <FileText className="h-4 w-4 text-azul-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        Consolidado del grado
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {report.degree.name} · {report.year} ·{" "}
                        {report.students.length}{" "}
                        {report.students.length === 1
                          ? "estudiante"
                          : "estudiantes"}
                        {counts
                          ? ` · ${counts.aprobado} aprobados · ${counts.pendiente} pendientes · ${counts.en_riesgo} en riesgo`
                          : ""}
                      </p>
                    </div>
                  </div>
                  {report.students.length > 0 && (
                    <Button
                      onClick={handlePrintAll}
                      disabled={isBulkPrinting}
                      aria-busy={isBulkPrinting}
                      className="bg-success text-success-foreground hover:bg-success/90"
                    >
                      {isBulkPrinting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {isBulkPrinting ? "Preparando..." : "Imprimir todos"}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4">
                <p className="mb-1 text-xs leading-none text-muted-foreground">
                  Aprobado: 4 periodos, sin Bajo y promedio ≥ 3.0. Pendiente:
                  falta una nota. En riesgo: materia en Bajo o promedio &lt; 3.0.
                  P1–P4: materias con nota.
                </p>
                {report.students.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border">
                    <Table className="table-fixed">
                      <colgroup>
                        <col className="w-[38%]" />
                        <col className="w-[5.5%]" />
                        <col className="w-[5.5%]" />
                        <col className="w-[5.5%]" />
                        <col className="w-[5.5%]" />
                        <col className="w-[8%]" />
                        <col className="w-[8%]" />
                        <col className="w-[9%]" />
                        <col className="w-[15%]" />
                      </colgroup>
                      <TableHeader>
                        <TableRow className="bg-muted hover:bg-muted">
                          <TableHead className="h-auto px-2 py-1 font-bold text-foreground">
                            Estudiante
                          </TableHead>
                          <TableHead className="h-auto px-1 py-1 text-center font-bold text-foreground">
                            P1
                          </TableHead>
                          <TableHead className="h-auto px-1 py-1 text-center font-bold text-foreground">
                            P2
                          </TableHead>
                          <TableHead className="h-auto px-1 py-1 text-center font-bold text-foreground">
                            P3
                          </TableHead>
                          <TableHead className="h-auto px-1 py-1 text-center font-bold text-foreground">
                            P4
                          </TableHead>
                          <TableHead className="h-auto px-1 py-1 text-center font-bold text-foreground">
                            Promedio
                          </TableHead>
                          <TableHead className="h-auto px-1 py-1 text-center font-bold text-foreground">
                            Desempeño
                          </TableHead>
                          <TableHead className="h-auto px-1 py-1 text-center font-bold text-foreground">
                            Estado
                          </TableHead>
                          <TableHead className="h-auto px-1 py-1 text-center font-bold text-foreground">
                            Acciones
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.students.map((student, index) => (
                          <TableRow key={student.student.id}>
                            <TableCell className="px-2 py-0.5">
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-azul-100 text-[11px] font-bold text-azul-700">
                                  {index + 1}
                                </span>
                                <p
                                  className="truncate font-medium text-foreground"
                                  title={student.student.name}
                                >
                                  {student.student.name}
                                </p>
                              </div>
                            </TableCell>
                            {student.periodCoverage.map((coverage) => (
                              <TableCell
                                key={coverage.period}
                                className={cn(
                                  "px-1 py-0.5 text-center text-sm",
                                  coverageClass(coverage)
                                )}
                              >
                                <span
                                  title={`Periodo ${coverage.period}: ${coverage.gradedSubjects} de ${coverage.totalSubjects} materias con nota`}
                                >
                                  {coverage.gradedSubjects}/{coverage.totalSubjects}
                                </span>
                              </TableCell>
                            ))}
                            <TableCell className="px-1 py-0.5 text-center text-sm font-semibold">
                              {formatGrade(student.generalAverage)}
                            </TableCell>
                            <TableCell className="px-1 py-0.5 text-center">
                              {student.generalPerformanceLabel ? (
                                <span
                                  className={cn(
                                    "inline-flex min-w-8 justify-center rounded px-1.5 py-0.5 text-xs font-bold",
                                    student.generalPerformanceClass
                                  )}
                                >
                                  {student.generalPerformanceLabel}
                                </span>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            <TableCell className="px-1 py-0.5 text-center">
                              <span
                                title={student.statusReason}
                                className={cn(
                                  "inline-flex rounded px-2 py-0.5 text-xs font-bold",
                                  annualStatusClass(student.status)
                                )}
                              >
                                {student.statusLabel}
                              </span>
                            </TableCell>
                            <TableCell className="px-1 py-0.5">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  aria-label={`Ver boletín final de ${student.student.name}`}
                                  onClick={() =>
                                    setSelectedStudentId(student.student.id)
                                  }
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Ver
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  aria-label={`Imprimir boletín final de ${student.student.name}`}
                                  onClick={() =>
                                    handlePrintOne(student.student.id)
                                  }
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                  Imprimir
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="mb-2 text-lg font-medium text-foreground">
                      No hay estudiantes en este grado
                    </h2>
                    <p className="max-w-md text-muted-foreground">
                      El consolidado anual se arma con los estudiantes
                      registrados en el grado seleccionado.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div style={{ display: "none" }}>
        {hiddenBulletin && report && (
          <BoletinFinalPrint
            printRef={singlePrintRef}
            bulletin={hiddenBulletin}
            year={String(report.year)}
            degreeName={report.degree.name}
          />
        )}
      </div>
      <div style={{ display: "none" }}>
        {report && bulkStudents.length > 0 && (
          <BulkBoletinFinalPrint
            printRef={bulkPrintRef}
            students={bulkStudents}
            year={String(report.year)}
            degreeName={report.degree.name}
          />
        )}
      </div>
    </div>
  );
}
