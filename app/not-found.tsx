import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper relative flex items-center justify-center px-6">
      <div className="absolute inset-0 blueprint-grid-fine opacity-30 pointer-events-none" />

      <div className="relative z-10 text-center max-w-md">
        <p className="eyebrow text-xs text-blueprint mb-4">404 error</p>
        <h1 className="font-display text-5xl md:text-6xl font-black text-ink tracking-tight mb-4">
          Page not found.
        </h1>
        <p className="font-body text-ink-soft leading-relaxed mb-8">
          We couldn&apos;t find the page you were looking for. It may have
          been moved, or the link might be incorrect.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display font-bold text-white bg-blueprint hover:bg-ink transition-colors duration-200 rounded px-8 py-4 text-base"
        >
          Back to Home
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
