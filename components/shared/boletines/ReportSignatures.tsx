import Image from "next/image";

// Signatures component. `compact` keeps the same firmas in a shorter block.
const ReportSignatures = ({ compact = false }: { compact?: boolean }) => (
  <div
    className={`flex items-end justify-between align-top ${compact ? "px-8" : "px-12"}`}
  >
    <div className="text-center">
      <div
        className={`mb-1 flex items-end justify-center ${compact ? "h-12" : "h-16"}`}
      >
        <Image
          src="/images/firma-madre.png"
          alt="Firma Rectora"
          width={120}
          height={60}
          className={compact ? "mx-auto h-10 w-auto" : "mx-auto"}
          priority
          unoptimized
        />
      </div>
      <div className="border-t border-black pt-1 w-40 text-sm">Rectora</div>
    </div>
    <div className="text-center">
      <div className="mb-1 h-12"></div>
      <div className="border-t border-black pt-1 w-40 text-sm">Docente</div>
    </div>
  </div>
);

export default ReportSignatures;
