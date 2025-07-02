import Image from "next/image";
import React from "react";
import { FormattedStudentReport } from "./ReportsTable";
import ReportGradesTable from "./ReportGradesTable";
import ReportObservation from "./ReportObservation";
import ReportSignatures from "./ReportSignatures";
import { DOCENTES_BY_GRADE, PREESCOLAR_LEVEL } from "@/lib/constant";

const BoletinPrint = ({
  printRef,
  report,
  year,
}: {
  printRef: React.RefObject<HTMLDivElement>;
  report: FormattedStudentReport | null;
  year: string;
}) => {
  return (
    <div ref={printRef} className="p-8 max-w-4xl mx-auto">
      <div className="p-4">
        {/* Header with Logo and Institution Info */}
        <div className="flex justify-start relative">
          <div className="mr-10 ml-26">
            <Image
              priority
              src="/logo.png"
              alt="Logo Institucional"
              width={80}
              height={80}
            />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold uppercase">
              INSTITUTO ANGELITOS ALEGRES
            </h1>
            <p className="text-xs">Nuevo Bosque Trv. 51 N° 29 B 77</p>
            <p className="text-xs">
              Aprobado por Resolución #2815 del 4 de junio de 2020
            </p>
            <p className="text-xs">Dane: 313001000185</p>
          </div>

          {/* Grading Scale Table - Positioned to the right */}
          <div className="absolute right-0 top-10">
            <table className="border border-gray-800 text-xs">
              <tbody>
                <tr>
                  <td className="border border-gray-800 px-2 py-0.5 font-bold">
                    BAJO
                  </td>
                  <td className="border border-gray-800 px-2 py-0.5">
                    1,0 - 2,9
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 px-2 py-0.5 font-bold">
                    BÁSICO
                  </td>
                  <td className="border border-gray-800 px-2 py-0.5">
                    3,0 - 3,9
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 px-2 py-0.5 font-bold">
                    ALTO
                  </td>
                  <td className="border border-gray-800 px-2 py-0.5">
                    4,0 - 4,5
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 px-2 py-0.5 font-bold">
                    SUPERIOR
                  </td>
                  <td className="border border-gray-800 px-2 py-0.5">
                    4,6 - 5,0
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Educational Level */}
        <div className="text-center mt-10 mb-2">
          <h3 className="text-sm font-bold uppercase">
            Nivel{" "}
            {PREESCOLAR_LEVEL.includes(report?.degree?.name || "")
              ? "PREESCOLAR"
              : "PRIMARIA"}
          </h3>
          <p className="text-xs uppercase font-semibold">
            Datos del Estudiante
          </p>
        </div>

        {/* Student Information */}
        <div className="border border-gray-400 mb-4">
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="border-b border-gray-400 px-2 py-1">
                  <span className="font-bold">NOMBRES Y APELLIDOS: </span>
                  {report?.student.name}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="border-r border-gray-400 px-2 py-1">
                  <span className="font-bold">GRADO: </span>{" "}
                  {report?.degree?.name}
                </td>
                <td className="border-r border-gray-400 px-2 py-1">
                  <span className="font-bold">DOCENTE: </span>
                  {
                    DOCENTES_BY_GRADE[
                      report?.degree?.name as keyof typeof DOCENTES_BY_GRADE
                    ]
                  }
                </td>
                <td className="px-2 py-1">
                  <span className="font-bold">AÑO: </span>
                  {year}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Subjects Table */}
        {report && (
          <>
            <ReportGradesTable report={report} />
            <ReportObservation
              observation={report.observations[report.lastPeriodNumber]}
            />
            <ReportSignatures />
          </>
        )}
      </div>
    </div>
  );
};

export default BoletinPrint;
