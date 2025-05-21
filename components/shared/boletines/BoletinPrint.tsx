import Image from "next/image";
import React from "react";
import { FormattedStudentReport } from "./ReportsTable";
import ReportGradesTable from "./ReportGradesTable";
import ReportObservation from "./ReportObservation";
import ReportSignatures from "./ReportSignatures";

const BoletinPrint = ({
  printRef,
  report,
}: {
  printRef: React.RefObject<HTMLDivElement>;
  report: FormattedStudentReport | null;
}) => {
  return (
    <div ref={printRef} className="p-8 max-w-4xl mx-auto">
      <div className="p-4">
        {/* Header with Logo and Institution Info */}
        <div className="flex justify-center">
          <div className="w-20 mr-10">
            <Image
              priority
              src="/logo.png"
              alt="Logo Institucional"
              width={80}
              height={80}
              // className="h-20 w-auto rounded-full"
            />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold uppercase">
              INSTITUTO ANGELITOS ALEGRES
            </h1>
            <p className="text-xs">Nuevo Bosque Trv. 51 N° 29 B 77</p>
            <p className="text-xs">Aprobado por Resolución N° 7962</p>
            <p className="text-xs">Dane: 313001000185</p>
          </div>
        </div>

        {/* Report Title Section with Grading Scale */}
        <div className="flex flex-col items-center mt-2 relative">
          <div className="w-full text-center font-bold py-1 mb-4">
            <h2 className="text-sm uppercase font-bold">
              Informe Académico Segundo Periodo
            </h2>
          </div>

          {/* Grading Scale Table - Absolute positioned to the right */}
          <div className="absolute right-0 top-0">
            <table className="border border-gray-800 text-xs">
              <tbody>
                <tr>
                  <td className="border border-gray-800 px-2 py-0.5 font-bold">
                    BAJO
                  </td>
                  <td className="border border-gray-800 px-2 py-0.5">0-2.99</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 px-2 py-0.5 font-bold">
                    BÁSICO
                  </td>
                  <td className="border border-gray-800 px-2 py-0.5">
                    3.0-3.99
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 px-2 py-0.5 font-bold">
                    ALTO
                  </td>
                  <td className="border border-gray-800 px-2 py-0.5">
                    4.0-4.5
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 px-2 py-0.5 font-bold">
                    SUPERIOR
                  </td>
                  <td className="border border-gray-800 px-2 py-0.5">
                    4.6-5.0
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Educational Level */}
        <div className="text-center mt-4 mb-2">
          <h3 className="text-sm font-bold uppercase">Nivel Primaria</h3>
          <p className="text-xs uppercase font-semibold">
            Datos del Estudiante
          </p>
        </div>

        {/* Student Information */}
        <div className="border border-gray-800 mb-4">
          <table className="w-full text-xs border-b border-gray-800">
            <tbody>
              <tr>
                <td className="border-r border-gray-800 px-2 py-1">
                  <span className="font-bold">NOMBRES Y APELLIDOS: </span>
                  JUAN FELIPE CIACEDO CASTILLO
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="border-r border-gray-800 px-2 py-1">
                  <span className="font-bold">GRADO: </span>3°
                </td>
                <td className="border-r border-gray-800 px-2 py-1">
                  <span className="font-bold">DOCENTE: </span>ALIX GONZALEZ
                </td>
                <td className="border-r border-gray-800 px-2 py-1">
                  <span className="font-bold">FECHA DE ENTREGA: </span>
                  30/11/2024
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Subjects Table */}
        {report && <ReportGradesTable report={report} />}

        {report && (
          <>
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
