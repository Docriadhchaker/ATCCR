"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { loginAction, type LoginActionState } from "@/server/actions/auth.actions";

type Props = {
  locale: string;
  callbackUrl: string;
};

const initialState: LoginActionState = {};

export function LoginForm({ locale, callbackUrl }: Props) {
  const t = useTranslations("Auth");
  const boundAction = loginAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="mx-auto w-full max-w-sm space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          {t("passwordLabel")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error === "invalidCredentials"
            ? t("invalidCredentials")
            : t("genericError")}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {isPending ? t("signingIn") : t("signIn")}
      </button>
    </form>
  );
}
