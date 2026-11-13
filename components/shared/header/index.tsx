import { auth } from "@/auth";
import { getDegrees } from "@/lib/actions/degree.actions";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const session = await auth();
  const degrees = session?.user ? await getDegrees() : [];

  return <HeaderClient session={session} degrees={degrees} />;
}
