"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student } from "@prisma/client";
import { Subject } from "@prisma/client";
import { getGradesAndObservationsBySubjectPeriod } from "@/lib/actions/grade.actions";
import { saveGrades } from "@/lib/actions/grade.actions";
import { PREESCOLAR_LEVEL } from "@/lib/constant";
import { calculateDS } from "@/lib/utils";

interface GradeEntryFormProps {
  degree: { id: string; name: string };
  period: { id: string; number: string };
  subjects: Subject[];
  students: Student[];
}

export default function GradeEntryForm({
  degree,
  period,
  subjects,
  students,
}: GradeEntryFormProps) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [achievements, setAchievements] = useState<Record<string, string>>({});
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Handle subject change and fetch existing grades
  const handleSubjectChange = async (value: string) => {
    setSelectedSubject(value);

    if (value) {
      setLoading(true);
      try {
        const result = await getGradesAndObservationsBySubjectPeriod(
          value,
          period.id,
          degree.id
        );

        if (result.success && result.data) {
          // Initialize new grade, achievements, and observation state
          const newGrades: Record<string, string> = {};
          const newAchievements: Record<string, string> = {};
          const newObservations: Record<string, string> = {};

          // Populate with data from the server
          Object.entries(result.data).forEach(([studentId, data]) => {
            // Convert numeric grades to string for input display
            newGrades[studentId] = data.grade ? data.grade.toString() : "";
            newAchievements[studentId] = data.achievements;
            newObservations[studentId] = data.observation;
          });

          setGrades(newGrades);
          setAchievements(newAchievements);
          setObservations(newObservations);
        } else {
          console.error("Failed to fetch grades:", result.error);
          // Reset to empty state on error
          resetFormState();
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
        resetFormState();
      } finally {
        setLoading(false);
      }
    } else {
      resetFormState();
    }
  };

  const resetFormState = () => {
    setGrades({});
    setAchievements({});
    setObservations({});
  };

  const handleGradeChange = (studentId: string, value: string) => {
    // Allow empty input for clearing the field
    if (value === "") {
      setGrades((prev) => ({ ...prev, [studentId]: value }));
      return;
    }

    // Validate numeric input with up to one decimal place
    const numericRegex = /^([1-5](\.\d{0,1})?)?$/;

    if (numericRegex.test(value)) {
      // Check if it's within valid range (1.0 to 5.0)
      const numValue = parseFloat(value);
      if (numValue >= 1.0 && numValue <= 5.0) {
        setGrades((prev) => ({ ...prev, [studentId]: value }));
      }
    }
  };

  const handleAchievementsChange = (studentId: string, value: string) => {
    console.log(value);
    setAchievements((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleObservationChange = (studentId: string, value: string) => {
    setObservations((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSave = async () => {
    setSaving(true);

    // Create an array of student IDs that belong to this degree
    const degreeStudentIds = students
      .filter((student) => student.degreeId === degree.id)
      .map((student) => student.id);

    // Only save entries that have a grade, achievements, or observation
    const gradesToSave = degreeStudentIds
      .filter(
        (studentId) =>
          (grades[studentId]?.trim() !== "" &&
            grades[studentId] !== undefined) ||
          (achievements[studentId]?.trim() !== "" &&
            achievements[studentId] !== undefined) ||
          (observations[studentId]?.trim() !== "" &&
            observations[studentId] !== undefined)
      )
      .map((studentId) => {
        // Convert grade string to number for database
        let gradeValue = 0;
        if (grades[studentId] && grades[studentId].trim() !== "") {
          gradeValue = parseFloat(grades[studentId]);
          // Ensure it's a valid number
          if (isNaN(gradeValue)) {
            gradeValue = 0;
          }
        }

        return {
          studentId,
          subjectId: selectedSubject,
          periodId: period.id,
          value: gradeValue,
          achievements: achievements[studentId] || "",
          observation: observations[studentId] || "",
        };
      });

    if (gradesToSave.length === 0) {
      toast.error("No hay calificaciones, logros o observaciones para guardar");
      setSaving(false);
      return;
    }

    try {
      const result = await saveGrades(gradesToSave);
      if (result.success) {
        toast.success(`Datos guardados exitosamente`);
      } else {
        // TypeScript safeguarding for error property
        const errorMessage =
          "success" in result && "error" in result
            ? result.error
            : "Error desconocido";
        toast.error(`Error al guardar: ${errorMessage}`);
      }
    } catch (error) {
      console.error(
        "Error saving grades, achievements, and observations:",
        error
      );
      toast.error(
        "Error al guardar las calificaciones, logros y observaciones"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              Calificaciones: <Badge className="text-sm">{degree.name}</Badge>
              Periodo: <Badge className="text-sm">{period.number}</Badge>
            </CardTitle>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="subject-header"
                className="whitespace-nowrap text-sm font-bold"
              >
                {PREESCOLAR_LEVEL.includes(degree.name)
                  ? "DIMENSIONES"
                  : "ÁREAS (ASIGNATURAS)"}
              </Label>
              <Select
                value={selectedSubject}
                onValueChange={handleSubjectChange}
              >
                <SelectTrigger id="subject-header" className="max-w-fit">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        {selectedSubject ? (
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cargando calificaciones...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Table */}
                <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900 border-b">
                        <TableHead className="w-[60%] font-bold px-4 py-2	 text-gray-700 dark:text-gray-300">
                          Estudiante
                        </TableHead>
                        <TableHead className="w-[30%] font-bold px-4 py-2 text-gray-700 dark:text-gray-300">
                          Observación General
                        </TableHead>
                        <TableHead className="font-bold w-[5%] px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                          Nota
                        </TableHead>
                        <TableHead className="font-bold w-[5%] px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                          DS
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students
                        .filter((student) => student.degreeId === degree.id)
                        .map((student) => (
                          <TableRow
                            key={student.id}
                            className="border-b hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                          >
                            <TableCell className="w-[60%] p-4 align-bottom">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                                  {student.name}
                                </div>
                              </div>
                              <div className="relative">
                                <label className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                  Logros del estudiante
                                </label>
                                <Textarea
                                  placeholder="Describa los logros del estudiante para esta asignatura..."
                                  value={achievements[student.id] || ""}
                                  onChange={(e) =>
                                    handleAchievementsChange(
                                      student.id,
                                      e.target.value
                                    )
                                  }
                                  className="min-h-[120px] w-full whitespace-pre-wrap border-gray-300 dark:border-gray-700 rounded-md pt-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="w-[30%] p-4 align-bottom">
                              <div className="relative">
                                <label className="absolute -top-2 left-3 bg-white dark:bg-gray-800 px-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                  Observación general
                                </label>
                                <Textarea
                                  placeholder="Observaciones generales sobre el desempeño del estudiante..."
                                  value={observations[student.id] || ""}
                                  onChange={(e) =>
                                    handleObservationChange(
                                      student.id,
                                      e.target.value
                                    )
                                  }
                                  className="min-h-[120px] w-full whitespace-pre-wrap border-gray-300 dark:border-gray-700 rounded-md pt-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="w-[5%] p-4 align-middle text-center">
                              <div className="relative mt-4">
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="1.0"
                                  max="5.0"
                                  placeholder="0.0"
                                  value={grades[student.id] || ""}
                                  onChange={(e) =>
                                    handleGradeChange(
                                      student.id,
                                      e.target.value
                                    )
                                  }
                                  className="w-16 text-center font-bold text-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="block text-xs text-gray-500 mt-1">
                                  /5.0
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="w-[5%] p-4 align-middle text-center">
                              <div className="flex justify-center">
                                {(() => {
                                  const ds = calculateDS(
                                    grades[student.id] || ""
                                  );
                                  if (ds.label) {
                                    return (
                                      <Badge
                                        className={`${ds.color} w-8 text-center h-8`}
                                      >
                                        {ds.label}
                                      </Badge>
                                    );
                                  } else {
                                    return (
                                      <span className="text-gray-400 text-sm">
                                        -
                                      </span>
                                    );
                                  }
                                })()}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleSave}
                disabled={loading || saving}
                className=" font-medium px-8 py-2 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </div>
                ) : (
                  "Guardar Calificaciones"
                )}
              </Button>
            </div>
          </CardContent>
        ) : (
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Seleccione una asignatura
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Elija una asignatura del menú desplegable para comenzar a
                  ingresar calificaciones y observaciones para los estudiantes.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </>
  );
}
