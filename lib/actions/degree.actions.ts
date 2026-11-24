"use server";

import prisma from "@/db/prisma";
import { requireActionUser } from "@/lib/auth/access";

export async function getDegrees() {
  try {
    const user = await requireActionUser();
    const degrees = await prisma.degree.findMany({
      where:
        user.role === "ADMIN" ? {} : { id: { in: user.degreeIds } },
    });

    return degrees;
  } catch (error) {
    console.error("Error fetching degrees:", error);
    throw error;
  }
}
