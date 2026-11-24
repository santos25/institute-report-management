import { AnnualStudentBulletin } from "@/lib/annual-report";
import BoletinFinalPrint from "./BoletinFinalPrint";

/**
 * El mismo boletín final, un estudiante por hoja.
 */
const BulkBoletinFinalPrint = ({
  printRef,
  students,
  year,
  degreeName,
}: {
  printRef: React.RefObject<HTMLDivElement | null>;
  students: AnnualStudentBulletin[];
  year: string;
  degreeName: string;
}) => {
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
      {students.map((bulletin) => (
        <BoletinFinalPrint
          key={bulletin.student.id}
          bulletin={bulletin}
          year={year}
          degreeName={degreeName}
          className="boletin-page"
        />
      ))}
    </div>
  );
};

export default BulkBoletinFinalPrint;
