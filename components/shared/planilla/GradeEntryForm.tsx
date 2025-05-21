"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      alert("No hay calificaciones, logros o observaciones para guardar");
      return;
    }

    try {
      const result = await saveGrades(gradesToSave);
      if (result.success) {
        alert(`Datos guardados exitosamente`);
      } else {
        // TypeScript safeguarding for error property
        const errorMessage =
          "success" in result && "error" in result
            ? result.error
            : "Error desconocido";
        alert(`Error al guardar: ${errorMessage}`);
      }
    } catch (error) {
      console.error(
        "Error saving grades, achievements, and observations:",
        error
      );
      alert("Error al guardar las calificaciones, logros y observaciones");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <CardTitle>
              Calificaciones: {degree.name} - Periodo {period.number}
            </CardTitle>

            <div className="flex items-center gap-2">
              <Label htmlFor="subject-header" className="whitespace-nowrap">
                Asignatura:
              </Label>
              <Select
                value={selectedSubject}
                onValueChange={handleSubjectChange}
              >
                <SelectTrigger id="subject-header" className="w-[180px]">
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
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <p>Cargando calificaciones...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60%]">Estudiante</TableHead>
                      <TableHead className="w-[30%]">Observación General</TableHead>
                      <TableHead className="w-[10%]">
                        Calificación (1.0 - 5.0) -{" "}
                        {subjects.find((s) => s.id === selectedSubject)?.name}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students
                      .filter((student) => student.degreeId === degree.id)
                      .map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium w-[60%]">
                            {student.name}
                            <Textarea
                              placeholder="Logros del estudiante para esta asignatura"
                              value={achievements[student.id] || ""}
                              onChange={(e) =>
                                handleAchievementsChange(
                                  student.id,
                                  e.target.value
                                )
                              }
                              className="min-h-[120px] min-w-[500px] whitespace-pre-wrap"
                            />
                          </TableCell>
                          <TableCell className="w-[30%]">
                            <Textarea
                              placeholder="Observación general del estudiante"
                              value={observations[student.id] || ""}
                              onChange={(e) =>
                                handleObservationChange(
                                  student.id,
                                  e.target.value
                                )
                              }
                              className="min-h-[120px] whitespace-pre-wrap"
                            />
                          </TableCell>
                          <TableCell className="w-[10%]">
                            <Input
                              type="number"
                              step="0.1"
                              min="1.0"
                              max="5.0"
                              placeholder="Nota"
                              value={grades[student.id] || ""}
                              onChange={(e) =>
                                handleGradeChange(student.id, e.target.value)
                              }
                              className="w-20"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
                Guardar Calificaciones
              </Button>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Seleccione una asignatura para ver las calificaciones
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </>
  );
}
