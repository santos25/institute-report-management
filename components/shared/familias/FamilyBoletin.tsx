"use client";

import { useRef } from "react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import type { Degree } from "@prisma/client";
import BoletinPrint from "@/components/shared/boletines/BoletinPrint";
import { Button } from "@/components/ui/button";
import type { StudentReport } from "@/lib/actions/report.actions";
import { boletinDownloadTitle, formatStudentReport } from "@/lib/utils";

export default function FamilyBoletin({
  reportData,
  degreeId,
  degreeName,
  year,
  backHref,
}: {
  reportData: StudentReport;
  degreeId: string;
  degreeName: string;
  year: string;
  backHref: string;
}) {
  const printRef = useRef<HTMLDivElement>(null);
  const documentTitle = boletinDownloadTitle(degreeName, year).replace(
    /^Boletines-/,
    "Boletin-"
  );
  const printReport = useReactToPrint({
    contentRef: printRef,
    documentTitle,
  });
  const degree = {
    id: degreeId,
    name: degreeName,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  } as Degree;
  const report = formatStudentReport(reportData, [degree]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={backHref}
          className="text-sm font-semibold text-azul-700 underline-offset-4 hover:underline"
        >
          Volver a las notas
        </Link>
        <Button type="button" className="rounded-full" onClick={() => printReport()}>
          Imprimir o guardar PDF
        </Button>
      </div>
      <div className="overflow-x-auto print:overflow-visible">
        <div className="min-w-[48rem] print:min-w-0">
          <BoletinPrint printRef={printRef} report={report} year={year} />
        </div>
      </div>
    </div>
  );
}
