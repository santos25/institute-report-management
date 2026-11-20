import React from "react";
import { FormattedStudentReport } from "./ReportsTable";
import BoletinPrint from "./BoletinPrint";

interface BulkBoletinPrintProps {
  printRef: React.RefObject<HTMLDivElement | null>;
  reports: FormattedStudentReport[];
  year: string;
}

/**
 * Imprime el mismo boletín individual, un estudiante por bloque,
 * con salto de página entre cada uno.
 */
const BulkBoletinPrint = ({
  printRef,
  reports,
  year,
}: BulkBoletinPrintProps) => {
  return (
    <div ref={printRef}>
      <style>{`
        @media print {
          .boletin-page {
            break-after: page;
            page-break-after: always;
          }
          .boletin-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>
      {reports.map((report) => (
        <BoletinPrint
          key={report.student.id}
          report={report}
          year={year}
          className="boletin-page"
        />
      ))}
    </div>
  );
};

export default BulkBoletinPrint;
