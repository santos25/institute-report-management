"use server";

import prisma from "@/db/prisma";

export async function getPeriods() {
  try {
    const currentYear = new Date().getFullYear();

    const periods = await prisma.period.findMany({
      where: {
        year: currentYear,
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
