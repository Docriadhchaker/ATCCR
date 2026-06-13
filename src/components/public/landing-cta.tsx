import Link from "next/link";
import { FileText, LogIn, Ticket } from "lucide-react";

type Props = {
  locale: string;
  title: string;
  description: string;
  registrationLabel: string;
  registrationHint: string;
  submissionLabel: string;
  submissionHint: string;
  adminLoginLabel: string;
};

export function LandingCta({
  locale,
  title,
  description,
  registrationLabel,
  registrationHint,
  submissionLabel,
  submissionHint,
  adminLoginLabel,
}: Props) {
  return (
    <section
      id="cta"
      aria-labelledby="landing-cta-title"
      className="bg-muted py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl space-y-2 text-center">
          <h2 id="landing-cta-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">{description}</p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Ticket aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">{registrationLabel}</h3>
              <p className="text-sm text-muted-foreground">{registrationHint}</p>
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-auto inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
            >
              {registrationLabel}
            </button>
          </article>

          <article className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <FileText aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">{submissionLabel}</h3>
              <p className="text-sm text-muted-foreground">{submissionHint}</p>
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-auto inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
            >
              {submissionLabel}
            </button>
          </article>
        </div>

        <div className="flex justify-center">
          <Link
            href={`/${locale}/login`}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground outline-none transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <LogIn aria-hidden="true" className="h-4 w-4" />
            {adminLoginLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
