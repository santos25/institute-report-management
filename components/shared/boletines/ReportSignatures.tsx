import Image from "next/image";

// Signatures component
const ReportSignatures: React.FC = () => (
  <div className="pt-4">
    <div className="flex justify-between px-12 items-end">
      <div className="text-center">
        <div className="mb-1 h-16 flex items-end justify-center">
          <Image
            src="/images/firma-madre.png"
            alt="Firma Rectora"
            width={120}
            height={60}
            className="mx-auto"
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
  </div>
);

export default ReportSignatures;
