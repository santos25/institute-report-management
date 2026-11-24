import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildChildDetail, childBoletinAction, childDetailAction, childDetailToReport } from "./child-detail";

const studentA = {
  id: "est-a",
  name: "NIÑO A",
  guardianId: "gua-a",
  degreeId: "grado-1",
  degreeName: "PRIMERO",
};

const periods = [
  { id: "p1", number: 1, year: 2026, published: true },
  { id: "p2", number: 2, year: 2026, published: true },
  { id: "hidden", number: 3, year: 2026, published: false },
  { id: "old", number: 1, year: 2025, published: true },
];

const grades = [
  {
    studentId: "est-a",
    periodId: "p1",
    subjectId: "mat",
    subjectName: "MATEMÁTICAS",
    grade: 4.6,
    achievements: "Resuelve sumas.",
  },
  {
    studentId: "est-a",
    periodId: "old",
    subjectId: "mat",
    subjectName: "MATEMÁTICAS",
    grade: 5,
    achievements: "Año anterior.",
  },
  {
    studentId: "est-b",
    periodId: "p1",
    subjectId: "mat",
    subjectName: "MATEMÁTICAS",
    grade: 1.2,
    achievements: "Nota de otro niño.",
  },
  {
    studentId: "est-a",
    periodId: "p2",
    subjectId: "cie",
    subjectName: "CIENCIAS NATURALES",
    grade: 0,
    achievements: "Sin nota.",
  },
  {
    studentId: "est-a",
    periodId: "hidden",
    subjectId: "mat",
    subjectName: "MATEMÁTICAS",
    grade: 5,
    achievements: "Periodo sin publicar.",
  },
];

const observations = [
  { studentId: "est-a", periodId: "p1", content: "  Avanza con constancia.  " },
  { studentId: "est-b", periodId: "p1", content: "Observación ajena." },
  { studentId: "est-a", periodId: "old", content: "Observación de 2025." },
  { studentId: "est-a", periodId: "p2", content: "Solo observación." },
  { studentId: "est-a", periodId: "hidden", content: "Observación sin publicar." },
];

describe("detalle del hijo", () => {
  it("el acudiente ve nota, desempeño, logros y observación del año actual", () => {
    const detail = buildChildDetail({
      guardianId: "gua-a",
      year: 2026,
      student: studentA,
      periods,
      grades,
      observations,
    });

    assert.ok(detail);
    assert.equal(detail.student.name, "NIÑO A");
    assert.equal(detail.year, 2026);
    assert.deepEqual(
      detail.periods.map((period) => period.number),
      [1, 2]
    );
    assert.equal(detail.periods[0].subjects[0].grade, 4.6);
    assert.equal(detail.periods[0].subjects[0].performance?.code, "S");
    assert.equal(detail.periods[0].subjects[0].performance?.name, "Superior");
    assert.equal(detail.periods[0].subjects[0].achievements, "Resuelve sumas.");
    assert.equal(detail.periods[0].observation, "Avanza con constancia.");
    assert.equal(detail.periods[1].subjects.length, 0);
    assert.equal(detail.periods[1].observation, "Solo observación.");
    assert.equal(JSON.stringify(detail).includes("NIÑO B"), false);
    assert.equal(JSON.stringify(detail).includes("ajena"), false);
    assert.equal(JSON.stringify(detail).includes("Año anterior"), false);
    assert.equal(JSON.stringify(detail).includes("sin publicar"), false);
    assert.equal(JSON.stringify(detail).includes("promedio"), false);
  });

  it("un periodo del año actual que no está publicado no aparece", () => {
    const detail = buildChildDetail({
      guardianId: "gua-a",
      year: 2026,
      student: studentA,
      periods,
      grades,
      observations,
    });
    assert.ok(detail);
    assert.deepEqual(
      detail.periods.map((period) => period.number),
      [1, 2]
    );
    const report = childDetailToReport(detail);
    assert.deepEqual(
      report.periodGrades.map((period) => period.periodNumber),
      [1, 2]
    );
    assert.equal(JSON.stringify(report).includes("sin publicar"), false);
  });

  it("un estudiante de otro acudiente no devuelve datos", () => {
    const detail = buildChildDetail({
      guardianId: "gua-a",
      year: 2026,
      student: { ...studentA, id: "est-b", name: "NIÑO B", guardianId: "gua-b" },
      periods,
      grades,
      observations,
    });
    assert.equal(detail, null);
  });

  it("sin estudiante o sin acudiente no devuelve datos", () => {
    assert.equal(
      buildChildDetail({
        guardianId: "gua-a",
        year: 2026,
        student: null,
        periods,
        grades,
        observations,
      }),
      null
    );
    assert.equal(
      buildChildDetail({
        guardianId: "",
        year: 2026,
        student: studentA,
        periods,
        grades,
        observations,
      }),
      null
    );
  });

  it("la vista queda registrada con el id del propio hijo", () => {
    assert.equal(childDetailAction("est-a"), "VIEW_CHILD:est-a");
    assert.equal(childBoletinAction("est-a"), "VIEW_BOLETIN:est-a");
  });
});
