"use server";

import prisma from "@/db/prisma";
import { requireActionUser } from "@/lib/auth/access";
import { getActiveSchoolYear } from "@/lib/school-year";

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
