"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  const onLiberals = pathname?.startsWith("/liberals");
  const onGroups = pathname?.startsWith("/groups");

  const navLinks = onLiberals
    ? [{ href: "/liberals/courses", label: "Courses" }]
    : [];

  const cta = onLiberals
    ? { href: "/liberals/quiz", label: "Find My Liberal" }
    : onGroups
    ? { href: "/groups/quiz", label: "Find My Team" }
    : null;

  return (
    <header className="relative z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <span className="flex items-stretch gap-2 sm:gap-2.5">
            <span
              className="w-[3px] bg-ink group-hover:bg-blueprint transition-colors"
              aria-hidden="true"
            />
            <span className="flex flex-col justify-center font-display font-black leading-[1.05] text-ink text-[0.6rem] sm:text-xs md:text-sm group-hover:text-blueprint transition-colors">
              <span>First-Year</span>
              <span>Engineering</span>
              <span>Office</span>
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm text-ink-soft hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {cta && (
          <Link
            href={cta.href}
            className="shrink-0 inline-flex items-center gap-2 font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors duration-200 rounded px-4 py-2 sm:px-5 sm:py-2.5 text-sm"
          >
            {cta.label}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </header>
  );
}
