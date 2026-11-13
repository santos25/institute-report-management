"use client";

import { usePathname } from "next/navigation";
import { Cloud } from "lucide-react";

export function PortalTopBar() {
  const pathname = usePathname();
  
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = ["Portal Docentes"];
  
  if (segments.length > 1) {
    const page = segments[segments.length - 1];
    const pageNames: Record<string, string> = {
      planillas: "Planillas",
      boletines: "Boletines",
      grados: "Mis grados",
      admin: "Administración",
    };
    breadcrumbs.push(pageNames[page] || page);
  } else if (pathname === "/portal") {
    breadcrumbs.push("Inicio");
  }

  return (
    <header className="h-16 bg-white border-b border-[#E3E5EE] px-4 lg:px-8 flex items-center justify-between mt-14 lg:mt-0">
      <nav aria-label="Ruta" className="text-sm text-[#596074]">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            {index > 0 && <span className="mx-1.5">/</span>}
            <span
              className={
                index === breadcrumbs.length - 1
                  ? "text-[#1F2433] font-medium"
                  : ""
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-2 text-sm text-[#596074]">
        <Cloud className="w-4 h-4 text-[#15803D]" />
        <span>Todo guardado</span>
      </div>
    </header>
  );
}
