import { Course, CourseDataset, RecommendationResult } from "./types";
import { scoreItems } from "./matching";
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
 * Ranks a given list of courses against the student's selected interests and
 * returns the top N, via the shared scoring engine (lib/matching.ts). No
 * course code or interest id is special-cased anywhere in this function.
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
  // Eligibility is decided before scoring, and is unaffected by interest
  // overlap — see isEligibleForEngineeringStudent above.
  const eligible = courses.filter(isEligibleForEngineeringStudent);

  const scored = scoreItems(
    eligible.map((course) => ({
      id: course.courseCode,
      name: course.courseName,
      description: course.verified.description ?? "",
      interestTags: course.estimated?.interestTags ?? [],
    })),
    selectedInterestIds,
    INTERESTS,
    limit
  );

  // Map scored ids back to their full Course objects. verificationStatus is
  // never read in scoring, so a PARTIALLY_VERIFIED course scores identically
  // to a VERIFIED course with the same tags.
  const byCode = new Map(eligible.map((c) => [c.courseCode, c]));
  return scored.map((result) => ({
    course: byCode.get(result.item.id) as Course,
    score: result.score,
    matchedInterests: result.matchedInterests,
    usedResearchedTags: true,
  }));
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
 * How far (in score points, 0-100) the top course has to lead the next
 * distinct score before it counts as "clearly ahead" and gets shown alone
 * in Your Top Matches. Below this gap — or whenever more than one course
 * shares the top score — there's no honest way to call a single winner, so
 * students see the top group instead (see groupTopMatches).
 *
 * 15 was picked from the real data: course tag counts are 1-3, so same-tier
 * score "noise" from the specificity penalty in scoreItems is at most ~3
 * points, while actually matching one more of the student's interests is
 * worth roughly 30 points. 15 sits well clear of both. Tune it directly.
 */
export const CLEAR_LEAD_SCORE_GAP = 15;

export interface TopMatchGroups {
  topMatches: RecommendationResult[];
  alsoLike: RecommendationResult[];
}

/**
 * Splits an already score-sorted result list into "Your Top Matches" and
 * "You Might Also Like". Top Matches is 1 course if it's clearly ahead
 * (see CLEAR_LEAD_SCORE_GAP), otherwise the top 3 — padded up to 3 when the
 * tied group is smaller, or trimmed down to 3 when it's bigger (scoreItems'
 * seeded tie-break already picked which ones survive that trim). Since
 * alsoLike is just "everything after" in the same list, it can never repeat
 * a course that's already in topMatches.
 */
export function groupTopMatches(results: RecommendationResult[]): TopMatchGroups {
  if (results.length === 0) return { topMatches: [], alsoLike: [] };

  const topScore = results[0].score;
  const topTierCount = results.filter((r) => r.score === topScore).length;
  const nextDistinct = results.find((r) => r.score !== topScore);
  const gap = nextDistinct ? topScore - nextDistinct.score : Infinity;
  const clearlyAhead = topTierCount === 1 && gap >= CLEAR_LEAD_SCORE_GAP;

  const topCount = clearlyAhead ? 1 : Math.min(3, results.length);
  return {
    topMatches: results.slice(0, topCount),
    alsoLike: results.slice(topCount),
  };
}

export { getMatchExplanation } from "./matching";
