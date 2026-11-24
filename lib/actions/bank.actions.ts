"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import prisma from "@/db/prisma";
import {
  comparePerformance,
  isPerformance,
  type BankAchievement,
  type BankObservation,
  type BankSubject,
  type Performance,
  type PlanillaAchievement,
  type PlanillaObservation,
} from "@/lib/bank";
import { getActionUser } from "@/lib/auth/session";

export type BankActionResult = { ok: true } | { ok: false; error: string };

export type PlanillaBankResult =
  | {
      ok: true;
      achievements: PlanillaAchievement[];
      observations: PlanillaObservation[];
    }
  | { ok: false; error: string };

const CONTENT_MIN = 4;
const CONTENT_MAX = 1000;
const CATEGORY_MAX = 40;

async function requireBankSession() {
  const user = await getActionUser();
  if (!user) redirect("/login");
  return user;
}

function cleanContent(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function cleanCategory(value: string) {
  const category = value.trim().replace(/\s+/g, " ");
  return category.length > 0 ? category : null;
}

function validateContent(content: string): string | null {
  if (content.length < CONTENT_MIN || content.length > CONTENT_MAX) {
    return `Escribe una frase de entre ${CONTENT_MIN} y ${CONTENT_MAX} caracteres.`;
  }
  return null;
}

function validateCategory(category: string | null): string | null {
  if (category && category.length > CATEGORY_MAX) {
    return `La categoría puede tener hasta ${CATEGORY_MAX} caracteres.`;
  }
  return null;
}

function actionError(error: unknown, fallback: string): BankActionResult {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2025" || error.code === "P2003")
  ) {
    return { ok: false, error: "Esa frase ya no está en el banco." };
  }
  console.error(fallback, error);
  return { ok: false, error: fallback };
}

function sortSubjects(subjects: BankSubject[]) {
  return [...subjects].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export async function getBankPageData(): Promise<{
  subjects: BankSubject[];
  achievements: BankAchievement[];
  observations: BankObservation[];
}> {
  await requireBankSession();

  const [subjects, achievements, observations] = await Promise.all([
    prisma.subject.findMany({ select: { id: true, name: true } }),
    prisma.achievementTemplate.findMany({
      select: {
        id: true,
        content: true,
        subjectId: true,
        performance: true,
        subject: { select: { name: true } },
      },
    }),
    prisma.observationTemplate.findMany({
      select: { id: true, content: true, category: true },
      orderBy: [{ category: "asc" }, { content: "asc" }],
    }),
  ]);

  return {
    subjects: sortSubjects(subjects),
    achievements: achievements
      .flatMap((item) =>
        isPerformance(item.performance)
          ? [
              {
                id: item.id,
                content: item.content,
                subjectId: item.subjectId,
                subjectName: item.subject.name,
                performance: item.performance,
              },
            ]
          : []
      )
      .sort((a, b) => {
        const bySubject = a.subjectName.localeCompare(b.subjectName, "es");
        if (bySubject !== 0) return bySubject;
        const byPerformance = comparePerformance(a.performance, b.performance);
        if (byPerformance !== 0) return byPerformance;
        return a.content.localeCompare(b.content, "es");
      }),
    observations,
  };
}

export async function getPlanillaBank(
  subjectId: string
): Promise<PlanillaBankResult> {
  await requireBankSession();

  const subject = String(subjectId ?? "").trim();
  if (!subject) return { ok: false, error: "Selecciona una materia." };

  try {
    const [achievements, observations] = await Promise.all([
      prisma.achievementTemplate.findMany({
        where: { subjectId: subject },
        select: { id: true, content: true, performance: true },
      }),
      prisma.observationTemplate.findMany({
        select: { id: true, content: true, category: true },
        orderBy: [{ category: "asc" }, { content: "asc" }],
      }),
    ]);

    const phrases: PlanillaAchievement[] = achievements.flatMap((item) =>
      isPerformance(item.performance)
        ? [
            {
              id: item.id,
              content: item.content,
              performance: item.performance as Performance,
            },
          ]
        : []
    );

    phrases.sort((a, b) => {
      const byPerformance = comparePerformance(a.performance, b.performance);
      if (byPerformance !== 0) return byPerformance;
      return a.content.localeCompare(b.content, "es");
    });

    return { ok: true, achievements: phrases, observations };
  } catch (error) {
    console.error("Error consultando el banco:", error);
    return { ok: false, error: "No se pudo cargar el banco." };
  }
}

async function subjectExists(subjectId: string) {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: { id: true },
  });
  return Boolean(subject);
}

function readAchievementInput(input: {
  content: string;
  subjectId: string;
  performance: string;
}):
  | { ok: false; error: string }
  | { ok: true; content: string; subjectId: string; performance: Performance } {
  const content = cleanContent(input.content ?? "");
  const subjectId = String(input.subjectId ?? "").trim();
  const performance = String(input.performance ?? "");
  const contentError = validateContent(content);
  if (contentError) return { ok: false, error: contentError };
  if (!isPerformance(performance)) {
    return { ok: false, error: "Selecciona un desempeño: S, A, B o BJ." };
  }
  if (!subjectId) return { ok: false, error: "Selecciona una materia." };
  return { ok: true, content, subjectId, performance };
}

export async function createAchievementTemplate(input: {
  content: string;
  subjectId: string;
  performance: string;
}): Promise<BankActionResult> {
  await requireBankSession();
  const parsed = readAchievementInput(input);
  if (!parsed.ok) return parsed;

  try {
    if (!(await subjectExists(parsed.subjectId))) {
      return { ok: false, error: "Selecciona una materia." };
    }
    await prisma.achievementTemplate.create({
      data: {
        content: parsed.content,
        subjectId: parsed.subjectId,
        performance: parsed.performance,
      },
    });
    revalidatePath("/banco");
    return { ok: true };
  } catch (error) {
    return actionError(error, "No se pudo guardar el logro. Intenta de nuevo.");
  }
}

export async function updateAchievementTemplate(input: {
  id: string;
  content: string;
  subjectId: string;
  performance: string;
}): Promise<BankActionResult> {
  await requireBankSession();
  const id = String(input.id ?? "").trim();
  if (!id) return { ok: false, error: "No se encontró el logro." };
  const parsed = readAchievementInput(input);
  if (!parsed.ok) return parsed;

  try {
    if (!(await subjectExists(parsed.subjectId))) {
      return { ok: false, error: "Selecciona una materia." };
    }
    await prisma.achievementTemplate.update({
      where: { id },
      data: {
        content: parsed.content,
        subjectId: parsed.subjectId,
        performance: parsed.performance,
      },
    });
    revalidatePath("/banco");
    return { ok: true };
  } catch (error) {
    return actionError(error, "No se pudo actualizar el logro. Intenta de nuevo.");
  }
}

export async function deleteAchievementTemplate(
  id: string
): Promise<BankActionResult> {
  await requireBankSession();
  const templateId = String(id ?? "").trim();
  if (!templateId) return { ok: false, error: "No se encontró el logro." };

  try {
    await prisma.achievementTemplate.delete({ where: { id: templateId } });
    revalidatePath("/banco");
    return { ok: true };
  } catch (error) {
    return actionError(error, "No se pudo eliminar el logro. Intenta de nuevo.");
  }
}

function readObservationInput(input: { content: string; category: string }):
  | { ok: false; error: string }
  | { ok: true; content: string; category: string | null } {
  const content = cleanContent(input.content ?? "");
  const category = cleanCategory(input.category ?? "");
  const contentError = validateContent(content);
  if (contentError) return { ok: false, error: contentError };
  const categoryError = validateCategory(category);
  if (categoryError) return { ok: false, error: categoryError };
  return { ok: true, content, category };
}

export async function createObservationTemplate(input: {
  content: string;
  category: string;
}): Promise<BankActionResult> {
  await requireBankSession();
  const parsed = readObservationInput(input);
  if (!parsed.ok) return parsed;

  try {
    await prisma.observationTemplate.create({
      data: { content: parsed.content, category: parsed.category },
    });
    revalidatePath("/banco");
    return { ok: true };
  } catch (error) {
    return actionError(
      error,
      "No se pudo guardar la observación. Intenta de nuevo."
    );
  }
}

export async function updateObservationTemplate(input: {
  id: string;
  content: string;
  category: string;
}): Promise<BankActionResult> {
  await requireBankSession();
  const id = String(input.id ?? "").trim();
  if (!id) return { ok: false, error: "No se encontró la observación." };
  const parsed = readObservationInput(input);
  if (!parsed.ok) return parsed;

  try {
    await prisma.observationTemplate.update({
      where: { id },
      data: { content: parsed.content, category: parsed.category },
    });
    revalidatePath("/banco");
    return { ok: true };
  } catch (error) {
    return actionError(
      error,
      "No se pudo actualizar la observación. Intenta de nuevo."
    );
  }
}

export async function deleteObservationTemplate(
  id: string
): Promise<BankActionResult> {
  await requireBankSession();
  const templateId = String(id ?? "").trim();
  if (!templateId) return { ok: false, error: "No se encontró la observación." };

  try {
    await prisma.observationTemplate.delete({ where: { id: templateId } });
    revalidatePath("/banco");
    return { ok: true };
  } catch (error) {
    return actionError(
      error,
      "No se pudo eliminar la observación. Intenta de nuevo."
    );
  }
}
