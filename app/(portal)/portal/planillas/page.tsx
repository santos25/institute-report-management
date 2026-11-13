import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PlanillasPage } from "@/components/planillas/planillas-page";
import prisma from "@/db/prisma";
import { filterAccessibleDegrees } from "@/lib/auth-helpers";

interface PageProps {
  searchParams: Promise<{
    grado?: string;
    periodo?: string;
    area?: string;
  }>;
}

export default async function PlanillasRoute(props: PageProps) {
  const session = await auth();
  const searchParams = await props.searchParams;
  
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user's accessible degrees
  const allDegrees = await prisma.degree.findMany({
    orderBy: { name: "asc" },
  });
  
  const accessibleDegreeIds = await filterAccessibleDegrees(
    allDegrees.map((d) => d.id)
  );
  
  const degrees = allDegrees.filter((d) => accessibleDegreeIds.includes(d.id));

  // Fetch all periods
  const periods = await prisma.period.findMany({
    orderBy: [{ year: "desc" }, { number: "desc" }],
  });

  // If grado and periodo are selected, fetch data
  let selectedDegree = null;
  let selectedPeriod = null;
  let subjects: Array<{
    id: string;
    name: string;
  }> = [];
  let students: Array<{
    id: string;
    name: string;
    degreeId: string;
  }> = [];
  let grades: Array<{
    id: string;
    grade: number | null;
    achievements: string | null;
    studentId: string;
    student: {
      id: string;
      name: string;
    };
  }> = [];

  if (searchParams.grado && searchParams.periodo) {
    selectedDegree = degrees.find((d) => d.id === searchParams.grado);
    selectedPeriod = periods.find((p) => p.id === searchParams.periodo);

    if (selectedDegree && selectedPeriod) {
      // Fetch subjects for this degree
      subjects = await prisma.subject.findMany({
        where: {
          degrees: {
            some: {
              id: selectedDegree.id,
            },
          },
        },
        orderBy: { name: "asc" },
      });

      // Fetch students for this degree
      students = await prisma.student.findMany({
        where: {
          degreeId: selectedDegree.id,
        },
        orderBy: { name: "asc" },
      });

      // If area is selected, fetch grades for that subject
      if (searchParams.area) {
        const selectedSubject = subjects.find((s) => s.id === searchParams.area);
        
        if (selectedSubject) {
          grades = await prisma.studentGrade.findMany({
            where: {
              periodId: selectedPeriod.id,
              subjectId: selectedSubject.id,
              student: {
                degreeId: selectedDegree.id,
              },
            },
            include: {
              student: true,
            },
          });
        }
      }
    }
  }

  return (
    <PlanillasPage
      degrees={degrees}
      periods={periods}
      subjects={subjects}
      students={students}
      grades={grades}
      selectedDegreeId={searchParams.grado}
      selectedPeriodId={searchParams.periodo}
      selectedSubjectId={searchParams.area}
    />
  );
}
