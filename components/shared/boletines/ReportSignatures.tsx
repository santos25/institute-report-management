import Image from "next/image";

// Signatures component
const ReportSignatures: React.FC = () => (
  <div className="pt-8">
    <div className="flex justify-between px-12 items-end">
      <div className="text-center">
        <div className="mb-1 h-16 flex items-end justify-center">
          <Image
            src="/images/firma-madre.png"
            alt="Firma Rectora"
            width={120}
            height={60}
            className="mx-auto"
          />
        </div>
        <div className="border-t border-black pt-1 w-40">Rectora</div>
      </div>
      <div className="text-center">
        <div className="mb-2 h-16"></div>
        <div className="border-t border-black pt-1 w-40">Docente</div>
      </div>
    </div>
  </div>
);

export default ReportSignatures;
