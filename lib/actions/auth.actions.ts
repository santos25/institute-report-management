"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    return { success: true };
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
  await signOut({ redirectTo: "/login" });
}
