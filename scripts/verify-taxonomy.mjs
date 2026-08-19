#!/usr/bin/env node
/**
 * Dependency-free verification for the 36-interest taxonomy and its
 * curated course tags. Runs on plain Node (`node scripts/verify-taxonomy.mjs`)
 * with no new devDependency — data/interests.ts is a flat array literal so
 * its ids are extracted with a regex rather than importing the module
 * (Node can't resolve the "@/*" tsconfig path alias used inside it without
 * a bundler).
 *
 * Checks 4 and 5 mirror the pure scoring/eligibility logic in
 * lib/recommendation.ts as of this writing (recommendCoursesFrom's
 * coverage/specificity formula, isEligibleForEngineeringStudent's
 * eligibility rule). They are NOT a live import of that file — if its
 * algorithm changes, update the mirror here too, or replace this script
 * with a real unit test once a test runner is approved for this repo.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const fail = [];
const warn = [];

function check(label, condition) {
  if (!condition) fail.push(label);
}

// ---- Load data -------------------------------------------------------

const interestsSrc = fs.readFileSync(path.join(ROOT, "data/interests.ts"), "utf8");
const interestIds = [...interestsSrc.matchAll(/id:\s*"([\w-]+)"/g)].map((m) => m[1]);
const interestIdSet = new Set(interestIds);

const dataset = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/tmu_table_a_liberals.json"), "utf8")
);
const courses = dataset.courses;

// ---- 1. Every course has curated interestTags -------------------------

for (const c of courses) {
  const tags = c.estimated?.interestTags;
  check(`[1] ${c.courseCode} has non-empty interestTags`, Array.isArray(tags) && tags.length > 0);
}

// ---- 2. Every tag id used by a course exists in the taxonomy ----------

for (const c of courses) {
  for (const id of c.estimated?.interestTags ?? []) {
    check(`[2] ${c.courseCode} tag "${id}" is a valid interest id`, interestIdSet.has(id));
  }
}

// ---- 3. No orphan interests: every interest appears on >=1 course -----

const coverage = new Map(interestIds.map((id) => [id, 0]));
for (const c of courses) {
  for (const id of c.estimated?.interestTags ?? []) {
    if (coverage.has(id)) coverage.set(id, coverage.get(id) + 1);
  }
}
for (const [id, n] of coverage) {
  check(`[3] interest "${id}" has >=1 course`, n > 0);
}

check("[interests] taxonomy has exactly 36 interests", interestIds.length === 36);
check("[courses] dataset has exactly 121 courses", courses.length === 121);

// ---- 4. Deterministic scoring (mirror of recommendCoursesFrom) --------

function isEligible(course) {
  if (!course.verified?.description) return false;
  const restriction = course.verified?.programRestrictions;
  if (restriction && /engineer/i.test(restriction)) return false;
  return true;
}

function recommend(courseList, selectedIds, limit = 5) {
  if (selectedIds.length === 0) return [];
  const results = [];
  for (const course of courseList) {
    if (!isEligible(course)) continue;
    const tagIds = course.estimated?.interestTags ?? [];
    const overlap = tagIds.filter((id) => selectedIds.includes(id));
    if (overlap.length === 0) continue;
    const coverageFrac = overlap.length / selectedIds.length;
    const coverageScore = Math.max(100 * coverageFrac, 35);
    const specificity = Math.min(tagIds.length, 8);
    const score = Math.round(coverageScore * (1 - specificity * 0.015));
    results.push({ code: course.courseCode, score });
  }
  results.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.code.localeCompare(b.code)));
  return results.slice(0, limit);
}

const sampleSelection = ["world-religions", "world-languages", "sociology-society"];
const runA = JSON.stringify(recommend(courses, sampleSelection));
const runB = JSON.stringify(recommend(courses, sampleSelection));
check("[4] scoring is deterministic across repeated runs", runA === runB);

// ---- 5. Eligibility filtering is independent of tag matching ----------

const restrictedButTagged = courses.find(
  (c) =>
    c.verified?.programRestrictions &&
    /engineer/i.test(c.verified.programRestrictions) &&
    (c.estimated?.interestTags ?? []).length > 0
);
if (restrictedButTagged) {
  const results = recommend(courses, restrictedButTagged.estimated.interestTags, 121);
  check(
    `[5] engineering-restricted course "${restrictedButTagged.courseCode}" never appears in results`,
    !results.some((r) => r.code === restrictedButTagged.courseCode)
  );
} else {
  warn.push("[5] no engineering-restricted + tagged course found in current dataset to test against");
}

// ---- 6. Thin-interest warning (<=2 courses) ----------------------------

const thin = [...coverage.entries()].filter(([, n]) => n <= 2).sort((a, b) => a[1] - b[1]);
for (const [id, n] of thin) {
  warn.push(`[6] thin interest: "${id}" has only ${n} course(s)`);
}

// ---- 7. Documented subset-merge outcomes (post-approval) --------------

const byCode = new Map(courses.map((c) => [c.courseCode, c]));
const expectMerge = {
  "HST 119": ["film-studies"],
  "HST 219": ["social-justice-inequality", "film-studies"],
  "HST 375": ["gender-sexuality-studies"],
  "RMG 210": ["sociology-society"],
  "ASC 121": ["environment-sustainability"],
  "CMN 231": ["communication-media-studies", "pop-culture-digital-media"],
};
for (const [code, expected] of Object.entries(expectMerge)) {
  const actual = byCode.get(code)?.estimated?.interestTags ?? [];
  check(
    `[7] ${code} tags match approved post-merge set (${JSON.stringify(expected)})`,
    JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort())
  );
}
const droppedIds = [
  "history-through-film",
  "lgbtq-gender-history",
  "consumer-culture-everyday-life",
  "comics-graphic-storytelling",
  "architecture-built-environment",
];
for (const c of courses) {
  for (const id of c.estimated?.interestTags ?? []) {
    check(`[7] ${c.courseCode} does not carry dropped id "${id}"`, !droppedIds.includes(id));
  }
}

// ---- 8. Representative acceptance / regression checks -----------------

const chn101 = byCode.get("CHN 101")?.estimated?.interestTags ?? [];
check("[8] CHN 101 tags are exactly [world-languages]", JSON.stringify(chn101) === JSON.stringify(["world-languages"]));

const noPhysicsId = ![...interestIdSet].some((id) => /physic/i.test(id));
check("[8] taxonomy contains no Physics interest id", noPhysicsId);
const phl202 = byCode.get("PHL 202")?.estimated?.interestTags ?? [];
check(
  "[8] PHL 202 tags are exactly [philosophy-of-technology]",
  JSON.stringify(phl202) === JSON.stringify(["philosophy-of-technology"])
);

const noBiologyId = ![...interestIdSet].some((id) => /biolog/i.test(id));
check("[8] taxonomy contains no Biology interest id", noBiologyId);
const rel200 = byCode.get("REL 200")?.estimated?.interestTags ?? [];
check("[8] REL 200 tags are exactly [world-religions]", JSON.stringify(rel200) === JSON.stringify(["world-religions"]));

const bpm441 = byCode.get("BPM 441")?.estimated?.interestTags ?? [];
const approvedBpm441 = ["music-history-global-traditions", "film-studies"];
check(
  "[8] BPM 441 tags match the explicitly approved 2-tag set",
  JSON.stringify([...bpm441].sort()) === JSON.stringify([...approvedBpm441].sort())
);

check("[8] empty interest selection yields no results", recommend(courses, []).length === 0);

// ---- Report -------------------------------------------------------------

console.log(`Checked ${courses.length} courses against ${interestIds.length} interests.\n`);

if (warn.length > 0) {
  console.log(`WARNINGS (${warn.length}):`);
  for (const w of warn) console.log(`  - ${w}`);
  console.log("");
}

if (fail.length > 0) {
  console.log(`FAILURES (${fail.length}):`);
  for (const f of fail) console.log(`  - ${f}`);
  process.exit(1);
}

console.log("All checks passed.");
