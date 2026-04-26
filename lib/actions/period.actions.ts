"use server";

import prisma from "@/db/prisma";
import { getActiveSchoolYear } from "@/lib/school-year";

export async function getPeriods() {
  try {
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
