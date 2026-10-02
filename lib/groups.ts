import { GroupRecord, GroupsDataset, ScoredResult } from "./types";
import { scoreItems } from "./matching";
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
 * — then applies one groups-specific adjustment that doesn't belong in the
 * generic engine: a flat score boost for groups in the student's own
 * discipline. This can only ever affect items that already have at least
 * one real interest overlap (scoreItems drops zero-overlap items before the
 * boost is applied), and ranking is primarily by matched-interest count, so
 * the boost can only break ties or nudge within the same match tier — it
 * can never lift a weaker interest match above a stronger one.
 *
 * The student's own course union is deliberately excluded from this ranked
 * pool. It's a discipline-membership fact, not an interest match, and
 * frequently has little or no tag overlap with what the student picked
 * (e.g. Aerospace Course Union is tagged social/networking/workshops, not
 * "vehicles" or "robots"). Surface it separately via
 * getCourseUnionForProgram — see "Your course union" in the results UI.
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

  const courseUnion = getCourseUnionForProgram(program);
  const pool = audiencePool(program);
  const candidates = getAllGroups().filter(
    (g) => pool.includes(g.audience) && g.id !== courseUnion?.id
  );
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

  const results: ScoredResult<GroupRecord>[] = scored.map((r) => {
    const group = byId.get(r.item.id) as GroupRecord;
    const boosted =
      targetDiscipline !== null && group.discipline === targetDiscipline
        ? Math.min(100, r.score + DISCIPLINE_BOOST)
        : r.score;
    return { item: group, score: boosted, matchedInterests: r.matchedInterests };
  });

  // Rank by interest-match strength first, so the discipline boost can only
  // ever act within a match tier (break ties / nudge close scores) — never
  // let a group matching fewer of the student's picks outrank one matching
  // more of them.
  results.sort((a, b) => {
    if (b.matchedInterests.length !== a.matchedInterests.length) {
      return b.matchedInterests.length - a.matchedInterests.length;
    }
    if (b.score !== a.score) return b.score - a.score;
    return a.item.id.localeCompare(b.item.id);
  });

  return results.slice(0, limit);
}
