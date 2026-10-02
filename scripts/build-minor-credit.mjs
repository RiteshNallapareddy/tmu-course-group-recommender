#!/usr/bin/env node
/**
 * Cross-references data/tmu_table_a_liberals.json against data/tmu_minors.json
 * and writes the join to data/derived/minor-credit.json. Regenerate with
 * `node scripts/build-minor-credit.mjs` any time either source file changes
 * — this script never edits either source in place.
 *
 * The calendar is inconsistent about the space in course codes ("PHL 202"
 * vs "PHL202"), so both sides are matched on a whitespace-stripped,
 * uppercased key. The output is keyed using the canonical courseCode string
 * from tmu_table_a_liberals.json (the form the app already displays), so
 * nothing downstream needs to re-normalize at runtime.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function normalizeKey(code) {
  return code.toUpperCase().replace(/\s+/g, "");
}

const tableA = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/tmu_table_a_liberals.json"), "utf8")
);
const minorsDataset = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/tmu_minors.json"), "utf8")
);

// normalized key -> canonical Table A courseCode
const canonicalByKey = new Map(
  tableA.courses.map((c) => [normalizeKey(c.courseCode), c.courseCode])
);

const byCourse = {};
const byMinor = {};

function addCredit(canonicalCode, entry) {
  if (!byCourse[canonicalCode]) byCourse[canonicalCode] = [];
  byCourse[canonicalCode].push(entry);
}

for (const minor of minorsDataset.minors) {
  const requiredMatches = [];
  const electiveMatches = [];

  for (const rawCode of minor.requiredCourses ?? []) {
    const canonical = canonicalByKey.get(normalizeKey(rawCode));
    if (!canonical) continue;
    requiredMatches.push(canonical);
    addCredit(canonical, {
      minorName: minor.name,
      minorSlug: minor.slug,
      role: "required",
      chooseCount: null,
      optionPoolSize: null,
      sourceUrl: minor.sourceUrl,
    });
  }

  for (const group of minor.electiveGroups ?? []) {
    const optionPoolSize = group.options.length;
    for (const rawCode of group.options) {
      const canonical = canonicalByKey.get(normalizeKey(rawCode));
      if (!canonical) continue;
      electiveMatches.push({
        courseCode: canonical,
        chooseCount: group.chooseCount,
        optionPoolSize,
      });
      addCredit(canonical, {
        minorName: minor.name,
        minorSlug: minor.slug,
        role: "elective_option",
        chooseCount: group.chooseCount,
        optionPoolSize,
        sourceUrl: minor.sourceUrl,
      });
    }
  }

  if (requiredMatches.length > 0 || electiveMatches.length > 0) {
    byMinor[minor.slug] = {
      minorName: minor.name,
      sourceUrl: minor.sourceUrl,
      requiredMatches,
      electiveMatches,
    };
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  byCourse,
  byMinor,
};

const outDir = path.join(ROOT, "data/derived");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "minor-credit.json"),
  JSON.stringify(output, null, 2) + "\n"
);

const courseCount = Object.keys(byCourse).length;
const minorCount = Object.keys(byMinor).length;
console.log(
  `Wrote data/derived/minor-credit.json: ${courseCount} Table A course(s) carry minor credit across ${minorCount} minor(s).`
);
