"use client";

import Link from "next/link";

const NAV_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/#how-it-works", label: "How It Works" },
];

export default function SiteHeader() {
  return (
    <header className="relative z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-baseline gap-2.5 shrink-0 group">
          <span className="eyebrow text-[0.6rem] text-blueprint hidden sm:inline">
            TMU Engineering ·
          </span>
          <span className="font-display font-bold text-ink text-lg group-hover:text-blueprint transition-colors">
            Liberal Studies
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm text-ink-soft hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/quiz"
          className="shrink-0 inline-flex items-center gap-2 font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors duration-200 rounded px-4 py-2 sm:px-5 sm:py-2.5 text-sm"
        >
          Find My Liberal
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  );
}
