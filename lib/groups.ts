import { GroupRecord, GroupsDataset, ScoredResult } from "./types";
import { scoreItems } from "./matching";
import { interestsById } from "./tagging";
import {
  GROUP_INTERESTS,
  PROGRAM_TO_COURSE_UNION_ID,
  PROGRAM_TO_DISCIPLINE,
  ProgramId,
} from "@/data/groupInterests";
import rawDataset from "@/data/tmu_student_groups.json";

const dataset = rawDataset as unknown as GroupsDataset;

/** Every group this app can recommend from, read live from the JSON dataset. */
export function getAllGroups(): GroupRecord[] {
  return dataset.groups;
}

export function getStartYourOwnLinks() {
  return dataset.startYourOwn;
}

/**
 * The exact course-union record for a program, where the source data
 * genuinely has one. Several programs (Civil, Computer, Electrical,
 * Industrial Engineering) have none — returns null rather than guessing.
 */
export function getCourseUnionForProgram(program: ProgramId | null): GroupRecord | null {
  if (!program) return null;
  const id = PROGRAM_TO_COURSE_UNION_ID[program];
  if (!id) return null;
  return getAllGroups().find((g) => g.id === id) ?? null;
}

/**
 * Default audience pool is everything open to engineering students
 * (engineering-specific + all-FEAS groups). Architecture-only groups are
 * added on top only when the student's program is Architectural Science —
 * this is additive, not a swap, since nothing in the brief says to hide
 * cross-FEAS or engineering groups from an architecture student.
 */
function audiencePool(program: ProgramId | null): GroupRecord["audience"][] {
  const pool: GroupRecord["audience"][] = ["all_feas", "engineering"];
  if (program === "architectural_science") pool.push("architecture");
  return pool;
}

const DISCIPLINE_BOOST = 20;

/**
 * Ranks groups against the student's selected interests, the same way
 * recommendCourses ranks liberals — via the shared scorer in lib/matching.ts
 * — then applies two groups-specific adjustments that don't belong in the
 * generic engine:
 *   1. A flat score boost for groups in the student's own discipline.
 *   2. Pinning the student's exact course union into the results, so
 *      "you're already a member" always surfaces regardless of whether tag
 *      overlap alone would have ranked it highly enough.
 *
 * Identity-gated groups (Women in Engineering, NSBE) need no special
 * handling here: they're simply tagged with the opt-in
 * "community-and-identity-based-groups" interest alongside their genuine
 * activity tags, so normal overlap scoring already keeps them hidden unless
 * a student picks that interest or matches on their other real tags.
 */
export function recommendGroups(
  selectedInterestIds: string[],
  program: ProgramId | null,
  limit = 5
): ScoredResult<GroupRecord>[] {
  if (selectedInterestIds.length === 0) return [];

  const pool = audiencePool(program);
  const candidates = getAllGroups().filter((g) => pool.includes(g.audience));
  const byId = new Map(candidates.map((g) => [g.id, g]));

  const scored = scoreItems(
    candidates.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      interestTags: g.estimated.interestTags,
    })),
    selectedInterestIds,
    GROUP_INTERESTS,
    candidates.length
  );

  const targetDiscipline = program ? PROGRAM_TO_DISCIPLINE[program] : null;

  let results: ScoredResult<GroupRecord>[] = scored.map((r) => {
    const group = byId.get(r.item.id) as GroupRecord;
    const boosted =
      targetDiscipline !== null && group.discipline === targetDiscipline
        ? Math.min(100, r.score + DISCIPLINE_BOOST)
        : r.score;
    return { item: group, score: boosted, matchedInterests: r.matchedInterests };
  });

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.item.id.localeCompare(b.item.id);
  });

  results = results.slice(0, limit);

  const courseUnion = getCourseUnionForProgram(program);
  if (courseUnion && !results.some((r) => r.item.id === courseUnion.id)) {
    const overlap = courseUnion.estimated.interestTags.filter((t) =>
      selectedInterestIds.includes(t)
    );
    const pinned: ScoredResult<GroupRecord> = {
      item: courseUnion,
      score: 100,
      matchedInterests: interestsById(overlap, GROUP_INTERESTS),
    };
    results = [pinned, ...results].slice(0, limit);
  }

  return results;
}
