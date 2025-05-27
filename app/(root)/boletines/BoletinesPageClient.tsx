"use client";

import { useState } from "react";
import { Degree } from "@prisma/client";
import {
  getStudentReportsByDegreeAndYear,
  StudentReport,
} from "@/lib/actions/report.actions";
import ReportSelection from "@/components/shared/boletines/ReportSelection";
import ReportsTable from "@/components/shared/boletines/ReportsTable";

// Generate an array of recent years (current year and 5 previous years)
const YEARS = Array.from({ length: 6 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { id: year.toString(), year };
});

interface BoletinesPageClientProps {
  initialDegrees: Degree[];
}

export default function BoletinesPageClient({
  initialDegrees,
}: BoletinesPageClientProps) {
  // State for reports tab
  const [reportDegree, setReportDegree] = useState("");
  const [reportYear, setReportYear] = useState(
    new Date().getFullYear().toString()
  );
  const [showReports, setShowReports] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);

  // Report tab handlers
  const handleReportDegreeChange = (value: string) => {
    setReportDegree(value);
    setShowReports(false);
  };

  const handleReportYearChange = (value: string) => {
    setReportYear(value);
    setShowReports(false);
  };

  const handleSearchReports = async () => {
    if (reportDegree && reportYear) {
      setReportLoading(true);
      try {
        // Fetch report data for all students in selected degree for all periods in the year
        const reports = await getStudentReportsByDegreeAndYear(
          reportDegree,
          reportYear
        );

        setStudentReports(reports);
        setShowReports(true);
      } catch (error) {
        console.error("Error fetching report data:", error);
        alert(
          "Error al obtener datos de boletines: " + (error as Error).message
        );
      } finally {
        setReportLoading(false);
      }
    }
  };

  return (
    <div className="max-w-5xl container mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6">Reporte de Boletines</h1>

      <ReportSelection
        degrees={initialDegrees}
        years={YEARS}
        selectedDegree={reportDegree}
        selectedYear={reportYear}
        onDegreeChange={handleReportDegreeChange}
        onYearChange={handleReportYearChange}
        onSearch={handleSearchReports}
        loading={reportLoading}
      />

      {showReports && (
        <ReportsTable
          degrees={initialDegrees}
          selectedDegree={reportDegree}
          selectedYear={reportYear}
          studentReports={studentReports}
        />
      )}
    </div>
  );
}
