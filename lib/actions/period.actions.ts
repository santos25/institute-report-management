"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/db/prisma";
import { requireActionUser } from "@/lib/auth/access";
import { getActiveSchoolYear } from "@/lib/school-year";

export type PublishPeriodState = {
  error: string;
  published: boolean;
};

export async function publishPeriodForGuardians(
  _previous: PublishPeriodState,
  formData: FormData
): Promise<PublishPeriodState> {
  const user = await requireActionUser();
  if (user.role !== "ADMIN") {
    return {
      error: "Solo el administrador puede publicar un periodo para las familias.",
      published: false,
    };
  }

  const periodId = String(formData.get("periodId") ?? "");
  const year = getActiveSchoolYear();
  const period = await prisma.period.findFirst({
    where: { id: periodId, year },
    select: { id: true, visibleToGuardians: true },
  });
  if (!period) {
    return {
      error: "Ese periodo no está en el año actual.",
      published: false,
    };
  }
  if (!period.visibleToGuardians) {
    await prisma.period.update({
      where: { id: period.id },
      data: { visibleToGuardians: true },
    });
  }

  revalidatePath("/avance");
  revalidatePath("/familias");
  return { error: "", published: true };
}

export async function getPeriods() {
  try {
    await requireActionUser();
    const year = getActiveSchoolYear();

    const periods = await prisma.period.findMany({
      where: {
        year,
      },
      orderBy: {
        number: "asc",
      },
    });

    return periods;
  } catch (error) {
    console.error("Error fetching periods:", error);
    throw error;
  }
}
