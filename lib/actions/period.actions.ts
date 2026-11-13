"use server";

import prisma from "@/db/prisma";
import { getActiveSchoolYear } from "@/lib/school-year";
import { requireAuthOrThrow } from "@/lib/auth-helpers";

export async function getPeriods() {
  await requireAuthOrThrow();

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
