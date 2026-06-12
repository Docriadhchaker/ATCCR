import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATCCR Congress Platform",
  description: "Medical scientific congress management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
