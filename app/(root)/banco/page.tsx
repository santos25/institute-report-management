import type { Metadata } from "next";
import { getBankPageData } from "@/lib/actions/bank.actions";
import { requireUser } from "@/lib/auth/session";
import BancoManager from "./BancoManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Banco de logros | Angelitos Alegres",
};

export default async function BancoPage() {
  await requireUser();
  const data = await getBankPageData();
  return <BancoManager {...data} />;
}
