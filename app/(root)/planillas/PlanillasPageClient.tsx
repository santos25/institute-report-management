"use client";

import { useRef, useState } from "react";
import { Degree, Period, Subject, Student } from "@prisma/client";
import { getSubjectsByDegree } from "@/lib/actions/subject.actions";
import { getStudentsByDegree } from "@/lib/actions/student.actions";
import GradeEntryForm, {
  type GradeEntryFormHandle,
} from "@/components/shared/planilla/GradeEntryForm";
import GradeEntrySelection from "@/components/shared/planilla/GradeEntrySelection";
import UnsavedChangesDialog from "@/components/shared/planilla/UnsavedChangesDialog";

interface PlanillasPageClientProps {
  initialDegrees: Degree[];
  initialPeriods: Period[];
}

export default function PlanillasPageClient({
  initialDegrees,
  initialPeriods,
}: PlanillasPageClientProps) {
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [showGradeGrid, setShowGradeGrid] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [navDialogOpen, setNavDialogOpen] = useState(false);
  const [navSaving, setNavSaving] = useState(false);

  const formRef = useRef<GradeEntryFormHandle>(null);
  const pendingNavRef = useRef<(() => void) | null>(null);
  const navLockRef = useRef(false);
  const navDialogOpenRef = useRef(false);

  const performSearch = async () => {
    if (selectedDegree && selectedPeriod) {
      setLoading(true);
      try {
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

  const searchRef = useRef(performSearch);
  searchRef.current = performSearch;

  const runOrConfirm = (action: () => void) => {
    if (
      navDialogOpenRef.current ||
      navLockRef.current ||
      formRef.current?.isSaving()
    ) {
      return;
    }
    if (showGradeGrid && formRef.current?.hasUnsavedChanges()) {
      pendingNavRef.current = action;
      navDialogOpenRef.current = true;
      setNavDialogOpen(true);
      return;
    }
    action();
  };

  const handleDegreeChange = (value: string) => {
    if (value === selectedDegree) return;
    runOrConfirm(() => {
      setSelectedDegree(value);
      setShowGradeGrid(false);
    });
  };

  const handlePeriodChange = (value: string) => {
    if (value === selectedPeriod) return;
    runOrConfirm(() => {
      setSelectedPeriod(value);
      setShowGradeGrid(false);
    });
  };

  const handleSearch = () => {
    runOrConfirm(() => {
      void searchRef.current();
    });
  };

  const handleRequestSubjectChange = (subjectId: string) => {
    runOrConfirm(() => {
      formRef.current?.changeSubject(subjectId);
    });
  };

  const closeNavDialog = () => {
    pendingNavRef.current = null;
    navDialogOpenRef.current = false;
    setNavDialogOpen(false);
  };

  const handleNavDiscard = () => {
    if (navSaving) return;
    const action = pendingNavRef.current;
    pendingNavRef.current = null;
    navDialogOpenRef.current = false;
    setNavDialogOpen(false);
    formRef.current?.revert();
    action?.();
  };

  const handleNavSave = async () => {
    if (navLockRef.current) return;
    navLockRef.current = true;
    setNavSaving(true);
    try {
      const ok = await formRef.current?.save();
      if (!ok) return;
      const action = pendingNavRef.current;
      pendingNavRef.current = null;
      navDialogOpenRef.current = false;
      setNavDialogOpen(false);
      action?.();
    } finally {
      navLockRef.current = false;
      setNavSaving(false);
    }
  };

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
          key={`${selectedDegreeObj.id}-${selectedPeriodObj.id}`}
          ref={formRef}
          degree={{
            id: selectedDegreeObj.id,
            name: selectedDegreeObj.name,
          }}
          period={{
            id: selectedPeriodObj.id,
            number: selectedPeriodObj.number.toString(),
            year: selectedPeriodObj.year,
          }}
          subjects={subjects}
          students={students}
          onRequestSubjectChange={handleRequestSubjectChange}
        />
      )}

      <UnsavedChangesDialog
        open={navDialogOpen}
        saving={navSaving}
        onSave={() => {
          void handleNavSave();
        }}
        onDiscard={handleNavDiscard}
        onCancel={closeNavDialog}
      />
    </div>
  );
}
