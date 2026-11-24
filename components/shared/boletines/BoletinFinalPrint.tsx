import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DOCENTES_BY_GRADE, PREESCOLAR_LEVEL } from "@/lib/constant";
import {
  ANNUAL_PERIOD_NUMBERS,
  AnnualStudentBulletin,
  annualStatusClass,
  formatGrade,
} from "@/lib/annual-report";
import { cn } from "@/lib/utils";
import ReportSignatures from "./ReportSignatures";

const BoletinFinalPrint = ({
  printRef,
  bulletin,
  year,
  degreeName,
  className = "",
}: {
  printRef?: React.RefObject<HTMLDivElement | null>;
  bulletin: AnnualStudentBulletin;
  year: string;
  degreeName: string;
  className?: string;
}) => {
  const docente =
    DOCENTES_BY_GRADE[degreeName as keyof typeof DOCENTES_BY_GRADE] ?? "—";
  const level = PREESCOLAR_LEVEL.includes(degreeName) ? "PREESCOLAR" : "PRIMARIA";
  const areaLabel = PREESCOLAR_LEVEL.includes(degreeName)
    ? "DIMENSIONES"
    : "ÁREAS (ASIGNATURAS)";

  return (
    <div
      ref={printRef}
      className={cn(
        "boletin-sheet mx-auto max-w-4xl bg-card text-foreground",
        className
      )}
    >
      <style>{`
        @media print {
          @page {
            margin: 1.2cm;
            background: var(--card);
          }
          html, body {
            background: var(--card) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .boletin-sheet {
            box-shadow: none !important;
            border: none !important;
          }
          .no-page-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
      <div className="px-3 py-2">
        <div className="relative flex items-start justify-center">
          <div className="absolute left-0 top-0">
            <Image
              priority
              src="/logo.png"
              alt="Logo Institucional"
              width={64}
              height={64}
            />
          </div>
          <div className="px-24 text-center">
            <h2 className="text-base font-bold uppercase">
              Instituto Angelitos Alegres
            </h2>
            <p className="text-xs">Nuevo Bosque Trv. 51 N° 29 B 77</p>
            <p className="text-xs">
              Aprobado por Resolución #2815 del 4 de junio de 2020
            </p>
            <p className="text-xs">Dane: 313001000185</p>
          </div>
          <div className="absolute right-0 top-0">
            <table className="border border-tinta-800 text-xs">
              <tbody>
                <tr>
                  <td className="border border-tinta-800 px-1 py-0.5 font-bold">
                    BAJO
                  </td>
                  <td className="border border-tinta-800 px-1 py-0.5">
                    1,0 - 2,9
                  </td>
                </tr>
                <tr>
                  <td className="border border-tinta-800 px-1 py-0.5 font-bold">
                    BÁSICO
                  </td>
                  <td className="border border-tinta-800 px-1 py-0.5">
                    3,0 - 3,9
                  </td>
                </tr>
                <tr>
                  <td className="border border-tinta-800 px-1 py-0.5 font-bold">
                    ALTO
                  </td>
                  <td className="border border-tinta-800 px-1 py-0.5">
                    4,0 - 4,5
                  </td>
                </tr>
                <tr>
                  <td className="border border-tinta-800 px-1 py-0.5 font-bold">
                    SUPERIOR
                  </td>
                  <td className="border border-tinta-800 px-1 py-0.5">
                    4,6 - 5,0
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-1 mt-1 text-center">
          <h3 className="text-sm font-bold uppercase">Nivel {level}</h3>
          <p className="text-xs font-semibold uppercase">
            Boletín final del año lectivo
          </p>
        </div>

        <div className="mb-1 border border-tinta-400">
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="border-b border-tinta-400 px-2 py-1">
                  <span className="font-bold">NOMBRES Y APELLIDOS: </span>
                  {bulletin.student.name}
                </td>
              </tr>
            </tbody>
          </table>
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="border-r border-tinta-400 px-2 py-1">
                  <span className="font-bold">GRADO: </span>
                  <span className="uppercase">{degreeName}</span>
                </td>
                <td className="border-r border-tinta-400 px-2 py-1">
                  <span className="font-bold">DOCENTE: </span>
                  {docente}
                </td>
                <td className="px-2 py-1">
                  <span className="font-bold">AÑO: </span>
                  {year}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Table className="border text-xs">
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="h-auto border px-1 py-1 text-center text-xs font-bold whitespace-normal">
                {areaLabel}
              </TableHead>
              <TableHead className="h-auto border px-1 py-1 text-center text-xs font-bold">
                IH
              </TableHead>
              {ANNUAL_PERIOD_NUMBERS.map((period) => (
                <TableHead
                  key={period}
                  className="h-auto border px-1 py-1 text-center text-xs font-bold"
                >
                  P{period}
                </TableHead>
              ))}
              <TableHead className="h-auto border px-1 py-1 text-center text-xs font-bold">
                Definitiva
              </TableHead>
              <TableHead className="h-auto border px-1 py-1 text-center text-xs font-bold">
                Desempeño
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bulletin.subjects.map((subject) => (
              <TableRow key={subject.id} className="no-page-break hover:bg-transparent">
                <TableCell className="border px-1 py-0.5 text-xs font-medium whitespace-normal">
                  {subject.name}
                </TableCell>
                <TableCell className="border px-1 py-0.5 text-center text-xs">
                  {subject.hours == null ? "—" : subject.hours}
                </TableCell>
                {ANNUAL_PERIOD_NUMBERS.map((period) => (
                  <TableCell
                    key={period}
                    className="border px-1 py-0.5 text-center text-xs"
                  >
                    {formatGrade(subject.periods[period])}
                  </TableCell>
                ))}
                <TableCell className="border px-1 py-0.5 text-center text-xs font-semibold">
                  {formatGrade(subject.definitive)}
                </TableCell>
                <TableCell className="border px-1 py-0.5 text-center text-xs">
                  {subject.performanceLabel ? (
                    <span
                      className={cn(
                        "inline-flex min-w-8 justify-center rounded px-1.5 py-0.5 font-bold",
                        subject.performanceClass
                      )}
                    >
                      {subject.performanceLabel}
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-crema-100 hover:bg-crema-100">
              <TableCell
                colSpan={6}
                className="border px-1 py-0.5 text-right text-xs font-bold"
              >
                Promedio general anual
              </TableCell>
              <TableCell className="border px-1 py-0.5 text-center text-xs font-bold">
                {formatGrade(bulletin.generalAverage)}
              </TableCell>
              <TableCell className="border px-1 py-0.5 text-center text-xs">
                {bulletin.generalPerformanceLabel ? (
                  <span
                    className={cn(
                      "inline-flex min-w-8 justify-center rounded px-1.5 py-0.5 font-bold",
                      bulletin.generalPerformanceClass
                    )}
                  >
                    {bulletin.generalPerformanceLabel}
                  </span>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-1 border border-tinta-400 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-1">
            <p>
              <span className="font-bold">PROMEDIO GENERAL ANUAL: </span>
              {formatGrade(bulletin.generalAverage)}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold">ESTADO FINAL: </span>
              <span
                className={cn(
                  "inline-flex rounded px-2 py-0.5 font-bold",
                  annualStatusClass(bulletin.status)
                )}
              >
                {bulletin.statusLabel}
              </span>
            </p>
          </div>
          <p className="border-t border-tinta-400 px-2 py-1 leading-snug">
            {bulletin.statusReason}
          </p>
        </div>

        <p className="mt-1 text-[10px] leading-tight text-tinta-600">
          La definitiva es el promedio de P1, P2, P3 y P4 con nota, redondeado
          a un decimal. «—» es un periodo sin nota y no entra en el promedio.
          Desempeño: S superior (4,6–5,0), A alto (4,0–4,5), B básico (3,0–3,9),
          BJ bajo (1,0–2,9). Aprobado: los 4 periodos completos, sin Bajo y
          promedio de 3,0 o más. Pendiente: falta algún periodo. En riesgo: hay
          materias en Bajo o el promedio es menor a 3,0.
        </p>

        <div className="mt-1">
          <ReportSignatures compact />
        </div>
      </div>
    </div>
  );
};

export default BoletinFinalPrint;
