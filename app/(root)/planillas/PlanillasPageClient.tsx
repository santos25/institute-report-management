"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Degree, Period, Subject, Student } from "@prisma/client";
import { getSubjectsByDegree } from "@/lib/actions/subject.actions";
import { getStudentsByDegree } from "@/lib/actions/student.actions";
import { getStudentReportsByDegreeAndYear, StudentReport } from "@/lib/actions/report.actions";
import GradeEntryForm from "@/components/shared/planilla/GradeEntryForm";
import GradeEntrySelection from "@/components/shared/planilla/GradeEntrySelection";
import ReportSelection from "@/components/shared/boletines/ReportSelection";
import ReportsTable from "@/components/shared/boletines/ReportsTable";

// Generate an array of recent years (current year and 5 previous years)
const YEARS = Array.from({ length: 6 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { id: year.toString(), year };
});

interface PlanillasPageClientProps {
  initialDegrees: Degree[];
  initialPeriods: Period[];
}

export default function PlanillasPageClient({
  initialDegrees,
  initialPeriods,
}: PlanillasPageClientProps) {
  const [activeTab, setActiveTab] = useState("entry");

  // State for grade entry tab
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [showGradeGrid, setShowGradeGrid] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // State for reports tab
  const [reportDegree, setReportDegree] = useState("");
  const [reportYear, setReportYear] = useState(
    new Date().getFullYear().toString()
  );
  const [showReports, setShowReports] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);

  // Load subjects and students when degree changes
  const handleDegreeChange = async (value: string) => {
    setSelectedDegree(value);
    setShowGradeGrid(false);

    if (value) {
      setLoading(true);
      try {
        // Fetch subjects and students in parallel
        const [subjectsResult, studentsResult] = await Promise.all([
          getSubjectsByDegree(value),
          getStudentsByDegree(value),
        ]);

        setSubjects(subjectsResult);
        setStudents(studentsResult);
      } catch (error) {
        console.error("Error fetching degree data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSubjects([]);
      setStudents([]);
    }
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    setShowGradeGrid(false);
  };

  const handleSearch = () => {
    if (selectedDegree && selectedPeriod) {
      setShowGradeGrid(true);
    }
  };

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
        alert("Error al obtener datos de boletines: " + (error as Error).message);
      } finally {
        setReportLoading(false);
      }
    }
  };

  // Get the selected degree and period objects
  const selectedDegreeObj = initialDegrees.find((d) => d.id === selectedDegree);
  const selectedPeriodObj = initialPeriods.find((p) => p.id === selectedPeriod);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Registro de Calificaciones</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="entry">Entrada de Calificaciones</TabsTrigger>
          <TabsTrigger value="reports">Boletines</TabsTrigger>
        </TabsList>

        <TabsContent value="entry">
          <GradeEntrySelection
            degrees={initialDegrees}
            periods={initialPeriods}
            selectedDegree={selectedDegree}
            selectedPeriod={selectedPeriod}
            onDegreeChange={handleDegreeChange}
            onPeriodChange={handlePeriodChange}
            onSearch={handleSearch}
            loading={loading}
          />

          {showGradeGrid && selectedDegreeObj && selectedPeriodObj && (
            <GradeEntryForm
              degree={{
                id: selectedDegreeObj.id,
                name: selectedDegreeObj.name,
              }}
              period={{
                id: selectedPeriodObj.id,
                number: selectedPeriodObj.number.toString(),
              }}
              subjects={subjects}
              students={students}
            />
          )}
        </TabsContent>

        <TabsContent value="reports">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
