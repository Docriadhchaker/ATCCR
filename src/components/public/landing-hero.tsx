import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  description: string | null;
  dateRange: string;
  location: string;
  registerLabel: string;
  programLabel: string;
  programHref: string;
};

export function LandingHero({
  title,
  subtitle,
  description,
  dateRange,
  location,
  registerLabel,
  programLabel,
  programHref,
}: Props) {
  return (
    <section
      aria-labelledby="landing-hero-title"
      className="relative overflow-hidden bg-primary text-primary-foreground"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.35),transparent_55%)] motion-reduce:opacity-100" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
            {subtitle}
          </p>
          <h1
            id="landing-hero-title"
            className="text-3xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
          >
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium">
            <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0" />
            {dateRange}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium">
            <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
            {location}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-secondary/60 px-5 py-3 text-sm font-semibold text-secondary-foreground opacity-80"
          >
            {registerLabel}
          </span>
          <Link
            href={programHref}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-primary-foreground/30 bg-transparent px-5 py-3 text-sm font-semibold text-primary-foreground outline-none transition-colors duration-200 hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            {programLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
