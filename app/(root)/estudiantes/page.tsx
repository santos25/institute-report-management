import type { Metadata } from "next";
import { getStudentsPageData } from "@/lib/actions/student.actions";
import { requireUser } from "@/lib/auth/session";
import { NoAssignedDegrees } from "@/components/shared/portal/NoAssignedDegrees";
import EstudiantesManager from "./EstudiantesManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Estudiantes | Angelitos Alegres",
};

export default async function EstudiantesPage() {
  const user = await requireUser();
  const { students, degrees } = await getStudentsPageData();

  if (user.role === "TEACHER" && degrees.length === 0) {
    return <NoAssignedDegrees />;
  }

  return (
    <EstudiantesManager
      students={students}
      degrees={degrees.map((degree) => ({ id: degree.id, name: degree.name }))}
      canManage={user.role === "ADMIN"}
    />
  );
}
