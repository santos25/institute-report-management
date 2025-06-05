"use client";

import { useState } from "react";
import { Degree, Period, Subject, Student } from "@prisma/client";
import { getSubjectsByDegree } from "@/lib/actions/subject.actions";
import { getStudentsByDegree } from "@/lib/actions/student.actions";
import GradeEntryForm from "@/components/shared/planilla/GradeEntryForm";
import GradeEntrySelection from "@/components/shared/planilla/GradeEntrySelection";

interface PlanillasPageClientProps {
  initialDegrees: Degree[];
  initialPeriods: Period[];
}

export default function PlanillasPageClient({
  initialDegrees,
  initialPeriods,
}: PlanillasPageClientProps) {
  // State for grade entry tab
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [showGradeGrid, setShowGradeGrid] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDegreeChange = (value: string) => {
    setSelectedDegree(value);
    setShowGradeGrid(false);
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    setShowGradeGrid(false);
  };

  // Load subjects and students when click on search button
  const handleSearch = async () => {
    if (selectedDegree && selectedPeriod) {
      setLoading(true);
      try {
        // Fetch subjects and students in parallel
        const [subjectsResult, studentsResult] = await Promise.all([
          getSubjectsByDegree(selectedDegree),
          getStudentsByDegree(selectedDegree),
        ]);

        setSubjects(subjectsResult);
        setStudents(studentsResult);
      } catch (error) {
        setSubjects([]);
        setStudents([]);
        console.error("Error fetching degree data:", error);
      } finally {
        setLoading(false);
      }

      setShowGradeGrid(true);
    }
  };

  // Get the selected degree and period objects
  const selectedDegreeObj = initialDegrees.find((d) => d.id === selectedDegree);
  const selectedPeriodObj = initialPeriods.find((p) => p.id === selectedPeriod);

  return (
    <div className="max-w-6xl container mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6">Registro de Calificaciones</h1>

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
    </div>
  );
}
