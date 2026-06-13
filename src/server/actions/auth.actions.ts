"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export type LoginActionState = {
  error?: "invalidCredentials" | "generic";
};

export async function loginAction(
  locale: string,
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? `/${locale}/admin`);

  if (!email || !password) {
    return { error: "invalidCredentials" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "invalidCredentials" };
    }
    throw error;
  }

  return {};
}
