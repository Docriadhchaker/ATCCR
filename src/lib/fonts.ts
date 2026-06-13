import { Figtree, Noto_Sans } from "next/font/google";

/** Heading font — design-system/atccr-platform/MASTER.md (Figtree). */
export const fontHeading = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

/** Body font — design-system/atccr-platform/MASTER.md (Noto Sans). */
export const fontBody = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "700"],
});
