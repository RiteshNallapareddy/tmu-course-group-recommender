import { WORKSHOP_CATEGORIES } from "@/data/workshops";

/**
 * Static, non-personalized suggestions shown at the bottom of both results
 * pages. Deliberately not wired into any matching/scoring logic, and
 * deliberately carries no date or schedule information — see
 * data/workshops.ts and lib/types.ts (WorkshopCategory) for why.
 */
export default function WorkshopSuggestions() {
  return (
    <section className="mt-16 border-t border-line pt-10">
      <h2 className="eyebrow text-xs text-ink-soft mb-2">
        Workshops &amp; Certifications
      </h2>
      <p className="font-body text-sm text-ink-soft mb-5 max-w-lg">
        A few general suggestions worth a look — not matched to your
        interests above.
      </p>

      <ul className="flex flex-col gap-3">
        {WORKSHOP_CATEGORIES.map((category) => (
          <li
            key={category.id}
            className="rounded border border-line bg-white px-4 py-3"
          >
            <p className="font-body text-sm text-ink">
              You may be interested in{" "}
              <span className="font-bold">{category.label}</span> workshops.
            </p>
            {category.description && (
              <p className="font-body text-xs text-ink-soft mt-1">
                {category.description}
              </p>
            )}
            {category.hostUrl && (
              <a
                href={category.hostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-display font-bold text-xs text-blueprint hover:text-ink transition-colors mt-2"
              >
                Visit {category.hostName ?? "host site"}
                <span aria-hidden="true">→</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
