import { Course, CourseDataset, Interest, RecommendationResult } from "./types";
import { interestsById } from "./tagging";
import { INTERESTS } from "@/data/interests";
import rawDataset from "@/data/tmu_table_a_liberals.json";

const dataset = rawDataset as unknown as CourseDataset;

/**
 * Every course this app can recommend from, read live from the JSON dataset.
 * As Milestone 1 research fills in more VERIFIED / PARTIALLY_VERIFIED
 * records, this list grows automatically — nothing here is hardcoded to a
 * specific course.
 */
export function getAllCourses(): Course[] {
  return dataset.courses;
}

/**
 * A course's programRestrictions text explicitly names Engineering as an
 * excluded program. Deliberately narrow: this is the one eligibility fact
 * this app actually knows about its audience (every user is an Engineering
 * student choosing a Table A course). It is NOT a general restriction
 * checker — prerequisites/corequisites/antirequisites depend on what the
 * specific student has already taken, which this app has no way to know,
 * so those are surfaced to the student (see CourseCard) rather than used to
 * filter.
 */
const ENGINEERING_RESTRICTION_PATTERN = /engineer/i;

/**
 * Eligibility, decided independently of interest matching so a strong
 * interest match can never make an ineligible course outrank an eligible
 * one. A course must have a description (nothing can be explained to the
 * student without one) and must not carry an official restriction that
 * explicitly excludes Engineering students. An UNRESOLVED
 * programRestrictions (i.e. listed in missingFields) is deliberately not
 * treated as a restriction — unresolved is not the same as restricted.
 */
export function isEligibleForEngineeringStudent(course: Course): boolean {
  if (!course.verified.description) return false;
  const restriction = course.verified.programRestrictions;
  if (restriction && ENGINEERING_RESTRICTION_PATTERN.test(restriction)) {
    return false;
  }
  return true;
}

/**
 * Resolves a course's interest tags from the curated taxonomy data
 * (course.estimated.interestTags) — the only tag source scoring uses.
 */
function resolveCourseTags(course: Course): string[] {
  return course.estimated?.interestTags ?? [];
}

/**
 * Ranks a given list of courses against the student's selected interests and
 * returns the top N. Scoring is purely data-driven: it counts overlap
 * between selected interest ids and each course's resolved tags. No course
 * code or interest id is special-cased anywhere in this function.
 *
 * Takes an explicit course list (rather than reading the bundled dataset
 * directly) so eligibility + scoring can be exercised against synthetic
 * data in verification scripts. recommendCourses() below is the app's
 * actual entry point and always calls this with the real dataset.
 */
export function recommendCoursesFrom(
  courses: Course[],
  selectedInterestIds: string[],
  limit = 5
): RecommendationResult[] {
  if (selectedInterestIds.length === 0) return [];

  const results: RecommendationResult[] = [];

  for (const course of courses) {
    // Eligibility is decided before scoring, and is unaffected by interest
    // overlap — see isEligibleForEngineeringStudent above.
    if (!isEligibleForEngineeringStudent(course)) continue;

    const tagIds = resolveCourseTags(course);
    const overlap = tagIds.filter((id) => selectedInterestIds.includes(id));
    if (overlap.length === 0) continue;

    // Coverage rewards how many of the student's picks this course hits,
    // floored so a single-interest match still scores meaningfully (a
    // course matching all selected interests approaches 100). The floor is
    // applied to the coverage term itself, before the specificity penalty
    // below, so a broadly-tagged course and a narrowly-tagged course no
    // longer collapse to an identical score once floored.
    const coverage = overlap.length / selectedInterestIds.length; // 0..1
    const coverageScore = Math.max(100 * coverage, 35);

    // Mild penalty for very broad tag sets, capped so it can never erase a
    // genuine match's meaningfulness. This is evidence quality/specificity
    // of the tag match only — verificationStatus is never read here, so a
    // PARTIALLY_VERIFIED course scores identically to a VERIFIED course
    // with the same tags.
    const specificity = Math.min(tagIds.length, 8);
    const score = Math.round(coverageScore * (1 - specificity * 0.015));

    results.push({
      course,
      score,
      matchedInterests: interestsById(overlap),
      usedResearchedTags: true,
    });
  }

  // Deterministic ranking: score descending, then course code ascending as
  // an explicit tie-breaker, rather than relying on incidental JSON array
  // order (which a stable sort alone would otherwise fall back to).
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.course.courseCode.localeCompare(b.course.courseCode);
  });

  return results.slice(0, limit);
}

export function recommendCourses(
  selectedInterestIds: string[],
  limit = 5
): RecommendationResult[] {
  return recommendCoursesFrom(getAllCourses(), selectedInterestIds, limit);
}

export function getInterestList() {
  return INTERESTS;
}

/**
 * Short, plain-language sentence explaining why a course was recommended,
 * built only from interests the tagging logic actually matched for this
 * course — never claims a course is about something the data didn't
 * establish. Not currently wired into the UI (Phase 2 scope limited
 * CourseCard.tsx changes to the restriction-transparency fix only); exposed
 * here so it's ready to use and independently testable.
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
