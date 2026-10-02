import { Minor, MinorCreditDataset, MinorCreditEntry, MinorsDataset } from "./types";
import minorCreditRaw from "@/data/derived/minor-credit.json";
import minorsRaw from "@/data/tmu_minors.json";

const minorCredit = minorCreditRaw as unknown as MinorCreditDataset;
const minorsDataset = minorsRaw as unknown as MinorsDataset;

const minorsBySlug = new Map(minorsDataset.minors.map((m) => [m.slug, m]));

/**
 * This app only knows its audience is "TMU Engineering students" in general
 * (first-year common curriculum — see app/page.tsx), never which specific
 * discipline. So, mirroring the same broad /engineer/i check already used
 * for course-level restrictions in lib/recommendation.ts, a minor is hidden
 * if ANY program it excludes is an Engineering program, since we can't rule
 * out that it's the student's own. A minor whose exclusion data couldn't be
 * confirmed (NEEDS_VERIFICATION) is hidden outright — showing nothing beats
 * showing an unverified "yes you can take this."
 */
function isAvailableForEngineeringStudent(minor: Minor | undefined): boolean {
  if (!minor) return false;
  if (minor.verificationStatus === "NEEDS_VERIFICATION") return false;
  return !minor.programExclusions.some((p) => /engineer/i.test(p));
}

export function getMinorCreditForCourse(courseCode: string): MinorCreditEntry[] {
  const entries = minorCredit.byCourse[courseCode] ?? [];
  return entries.filter((entry) =>
    isAvailableForEngineeringStudent(minorsBySlug.get(entry.minorSlug))
  );
}
