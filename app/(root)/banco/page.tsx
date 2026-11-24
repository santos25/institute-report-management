import type { Metadata } from "next";
import { getBankPageData } from "@/lib/actions/bank.actions";
import BancoManager from "./BancoManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Banco de logros | Angelitos Alegres",
};

export default async function BancoPage() {
  const data = await getBankPageData();
  return <BancoManager {...data} />;
}
