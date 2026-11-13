"use server";

import prisma from "@/db/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function getDegrees() {
  const session = await requireAuth();

  try {
    // If TEACHER, only return their assigned degrees
    if (session.user.role === "TEACHER") {
      const degrees = await prisma.degree.findMany({
        where: {
          id: {
            in: session.user.degreeIds,
          },
        },
      });
      return degrees;
    }

    // ADMIN can see all degrees
    const degrees = await prisma.degree.findMany({});

    return degrees;
  } catch (error) {
    console.error("Error fetching degrees:", error);
    throw error;
  }
}
