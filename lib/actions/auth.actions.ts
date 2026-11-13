"use server";

import { signIn, signOut, auth } from "@/auth";
import { AuthError } from "next-auth";
import { sanitizeCallbackUrl } from "@/lib/auth-utils";

export async function authenticate(
  formData: FormData,
  callbackUrl?: string
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    const session = await auth();
    
    if (!session?.user) {
      return { error: "Error al iniciar sesión" };
    }

    let destination = "/portal";

    if (callbackUrl) {
      const sanitized = sanitizeCallbackUrl(callbackUrl);
      if (sanitized) {
        destination = sanitized;
      }
    }

    return { success: true, callbackUrl: destination };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas" };
        default:
          return { error: "Error al iniciar sesión" };
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirect: false });
}
