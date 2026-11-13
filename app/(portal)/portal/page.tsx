import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PortalHome } from "@/components/portal/home";
import prisma from "@/db/prisma";

export default async function PortalPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch the user's assigned degrees
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      degrees: {
        include: {
          students: true,
          subjects: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Get the current open period (Period 3 for 2026)
  const currentPeriod = await prisma.period.findFirst({
    where: {
      number: 3,
      year: 2026,
    },
  });

  // Get grades progress for each assigned degree
  const degreesProgress = await Promise.all(
    user.degrees.map(async (degree) => {
      const totalStudents = degree.students.length;
      const totalNotes = totalStudents * degree.subjects.length;

      // Count completed grades for this period
      const completedGrades = currentPeriod
        ? await prisma.studentGrade.count({
            where: {
              periodId: currentPeriod.id,
              student: {
                degreeId: degree.id,
              },
            },
          })
        : 0;

      // Get progress per subject
      const subjectsProgress = await Promise.all(
        degree.subjects.map(async (subject) => {
          const completedForSubject = currentPeriod
            ? await prisma.studentGrade.count({
                where: {
                  periodId: currentPeriod.id,
                  subjectId: subject.id,
                  student: {
                    degreeId: degree.id,
                  },
                },
              })
            : 0;

          return {
            subjectId: subject.id,
            subjectName: subject.name,
            completed: completedForSubject,
            total: totalStudents,
            percentage: totalStudents > 0 ? (completedForSubject / totalStudents) * 100 : 0,
          };
        })
      );

      return {
        degreeId: degree.id,
        degreeName: degree.name,
        totalStudents,
        completedGrades,
        totalNotes,
        percentage: totalNotes > 0 ? (completedGrades / totalNotes) * 100 : 0,
        subjectsProgress,
      };
    })
  );

  const totalMissingNotes = degreesProgress.reduce(
    (sum, degree) => sum + (degree.totalNotes - degree.completedGrades),
    0
  );

  return (
    <PortalHome
      user={user}
      currentPeriod={currentPeriod}
      degreesProgress={degreesProgress}
      totalMissingNotes={totalMissingNotes}
    />
  );
}
