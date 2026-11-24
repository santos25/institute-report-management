import type { Metadata } from "next";
import { getUsersPageData } from "@/lib/actions/user.actions";
import { requireAdminPage } from "@/lib/auth/session";
import UsuariosManager from "./UsuariosManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Usuarios | Angelitos Alegres",
};

export default async function UsuariosPage() {
  const currentUser = await requireAdminPage();
  const { users, degrees } = await getUsersPageData();

  return (
    <UsuariosManager
      users={users}
      degrees={degrees.map((degree) => ({ id: degree.id, name: degree.name }))}
      currentUserId={currentUser.id}
    />
  );
}
