import { Course, Interest } from "./types";
import { INTERESTS } from "@/data/interests";

/**
 * ⚠️ PROTOTYPE / TEMPORARY LOGIC ⚠️
 *
 * Guesses which interests a course matches by keyword-searching its name +
 * verified description against each interest's `keywords` list (see
 * data/interests.ts). This exists ONLY because the real, researched
 * interest tags don't exist in the dataset yet.
 *
 * Once course.estimated.interestTags is populated by real research,
 * lib/recommendation.ts stops calling this file entirely — see the
 * `usedResearchedTags` flag there. This function is intentionally kept
 * separate from the recommendation engine so it's obvious what to delete.
 */

/**
 * Keyword substrings that are listed for an interest in data/interests.ts
 * but produce demonstrable false positives against real course descriptions
 * (found during the Phase 2 audit): "physical" (e.g. "physical resources")
 * wrongly satisfying the "physics" interest, and "justice" (e.g. Plato's
 * Republic) wrongly satisfying "crime". Excluded here rather than editing
 * data/interests.ts so the interest taxonomy itself stays untouched — the
 * same keyword still works normally for other interests (e.g. "justice"
 * still matches "social-justice"). This is a small, evidence-based
 * exception list, not a general re-matching strategy — substring matching
 * elsewhere is left as-is because several keywords are intentional stems
 * (e.g. "politic" is meant to catch "politics"/"political").
 */
const AMBIGUOUS_KEYWORD_EXCLUSIONS: Record<string, string[]> = {
  physics: ["physical"],
  crime: ["justice"],
};

/**
 * Keyword/interest pairs where the keyword is short or common enough to
 * appear inside unrelated words as a raw substring (found during the Phase 3
 * audit against the 121-course dataset): "ai" inside "against"/"faith"/
 * "sustainability", "gene" inside "general", "invest" inside "investigate",
 * "graphic" inside "geographic", "media" inside "mediaeval"/"intermediate",
 * "story" inside "history", and "art" inside "part"/"start"/"earth". For
 * exactly these pairs, the keyword must match as a whole word (optionally
 * pluralized, e.g. "art"/"arts") rather than as a substring. Every other
 * keyword keeps plain substring matching, including intentional stems like
 * "politic" or "sustainab" that are deliberately meant to match multiple
 * word forms via substring containment.
 */
const WHOLE_WORD_KEYWORDS: Record<string, string[]> = {
  ai: ["ai"],
  genetics: ["gene"],
  investing: ["invest"],
  comics: ["graphic"],
  media: ["media"],
  communication: ["media"],
  "pop-culture": ["media"],
  storytelling: ["story"],
  creativity: ["art"],
  art: ["art"],
};

function isWholeWordMatch(haystack: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}s?\\b`).test(haystack);
}

export function guessInterestTagsForCourse(course: Course): string[] {
  const haystack = `${course.courseName} ${course.verified.description ?? ""}`.toLowerCase();

  const matched: string[] = [];
  for (const interest of INTERESTS) {
    const excluded = new Set(
      (AMBIGUOUS_KEYWORD_EXCLUSIONS[interest.id] ?? []).map((kw) => kw.toLowerCase())
    );
    const wholeWord = new Set(
      (WHOLE_WORD_KEYWORDS[interest.id] ?? []).map((kw) => kw.toLowerCase())
    );
    const hit = interest.keywords.some((kw) => {
      const lower = kw.toLowerCase();
      if (excluded.has(lower)) return false;
      return wholeWord.has(lower) ? isWholeWordMatch(haystack, lower) : haystack.includes(lower);
    });
    if (hit) matched.push(interest.id);
  }
  return matched;
}

export function interestsById(ids: string[]): Interest[] {
  return ids
    .map((id) => INTERESTS.find((i) => i.id === id))
    .filter((i): i is Interest => Boolean(i));
}
