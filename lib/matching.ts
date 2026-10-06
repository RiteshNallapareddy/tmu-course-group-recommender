import { Interest, Recommendable, ScoredResult } from "./types";
import { interestsById } from "./tagging";

/**
 * Deterministic pseudo-random tie-break key for a (seed, id) pair: the same
 * seed and id always hash to the same key, so re-rendering or reloading
 * with the same selected interests gives a stable order — but it isn't
 * alphabetical, and a different interest selection gives a different order.
 * FNV-1a; good enough for breaking ties fairly, not for anything
 * security-sensitive.
 */
function tieBreakKey(seed: string, id: string): number {
  let h = 0x811c9dc5;
  const s = `${seed}::${id}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Ranks any list of Recommendable items against a student's selected
 * interests and returns the top N. Scoring is purely data-driven: it counts
 * overlap between selected interest ids and each item's interestTags. No
 * item id or interest id is special-cased anywhere in this function, so the
 * same scorer backs every recommendation path (liberals, groups, ...).
 */
export function scoreItems<T extends Recommendable>(
  items: T[],
  selectedInterestIds: string[],
  allInterests: Interest[],
  limit = 5
): ScoredResult<T>[] {
  if (selectedInterestIds.length === 0) return [];

  const results: ScoredResult<T>[] = [];

  for (const item of items) {
    const tagIds = item.interestTags ?? [];
    const overlap = tagIds.filter((id) => selectedInterestIds.includes(id));
    if (overlap.length === 0) continue;

    // Coverage rewards how many of the student's picks this item hits,
    // floored so a single-interest match still scores meaningfully (an item
    // matching all selected interests approaches 100). The floor is applied
    // to the coverage term itself, before the specificity penalty below, so
    // a broadly-tagged item and a narrowly-tagged item no longer collapse to
    // an identical score once floored.
    const coverage = overlap.length / selectedInterestIds.length; // 0..1
    const coverageScore = Math.max(100 * coverage, 35);

    // Mild penalty for very broad tag sets, capped so it can never erase a
    // genuine match's meaningfulness. This is evidence quality/specificity
    // of the tag match only.
    const specificity = Math.min(tagIds.length, 8);
    const score = Math.round(coverageScore * (1 - specificity * 0.015));

    results.push({
      item,
      score,
      matchedInterests: interestsById(overlap, allInterests),
    });
  }

  // Deterministic ranking: score descending, then a tie-break seeded from
  // the student's own selected interests (not alphabetical — an
  // alphabetically-first item would otherwise always "win" a tie, which
  // isn't actually a better fit). Seeding on the interest set (sorted, so
  // click order doesn't matter) means the same selection reloads to the
  // same order instead of reshuffling every render.
  const tieSeed = [...selectedInterestIds].sort().join(",");
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (
      tieBreakKey(tieSeed, a.item.id) - tieBreakKey(tieSeed, b.item.id)
    );
  });

  return results.slice(0, limit);
}

/**
 * Short, plain-language sentence explaining why an item was recommended,
 * built only from interests the tagging logic actually matched — never
 * claims an item is about something the data didn't establish.
 */
export function getMatchExplanation(matchedInterests: Interest[]): string {
  const labels = matchedInterests.map((i) => i.label);
  if (labels.length === 0) return "";
  if (labels.length === 1) return `Matches your interest in ${labels[0]}.`;
  if (labels.length === 2) {
    return `Matches your interests in ${labels[0]} and ${labels[1]}.`;
  }
  const allButLast = labels.slice(0, -1).join(", ");
  const last = labels[labels.length - 1];
  return `Strong match for your interests in ${allButLast}, and ${last}.`;
}
