"use server";

import prisma from "@/db/prisma";

export async function getDegrees() {
  try {
    const degrees = await prisma.degree.findMany({});

    return degrees;
  } catch (error) {
    console.error("Error fetching degrees:", error);
    throw error;
  }
}
