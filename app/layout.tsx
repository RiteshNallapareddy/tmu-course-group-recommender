import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Find Your Path — TMU Engineering",
  description:
    "Find the TMU Table A Liberal Studies course, design team, or student group that matches what you're actually interested in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
