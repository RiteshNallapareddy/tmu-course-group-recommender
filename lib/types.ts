// Types mirror the shape of data/tmu_table_a_liberals.json (the verified dataset)
// plus the optional future fields the recommendation engine already knows how
// to use once real research fills them in (see lib/recommendation.ts).

export type VerificationStatus =
  | "VERIFIED"
  | "PARTIALLY_VERIFIED"
  | "NEEDS_VERIFICATION";

export interface VerifiedFields {
  liberalStudiesLevel: string | null;
  engineeringEligible: boolean;
  tableASourceUrl: string;
  tableASourceEdition: string;
  description: string | null;
  weeklyContact: string | null;
  gpaWeight: number | null;
  prerequisites: string | null;
  corequisites: string | null;
  antirequisites: string | null;
  programRestrictions: string | null;
  descriptionSourceUrl: string | null;
  descriptionSourceEdition: string | null;
}

export interface EstimatedFields {
  note?: string;
  // Curated interest IDs from the real 36-interest taxonomy (data/interests.ts).
  interestTags?: string[];
  difficulty?: number;
  idealStudent?: string;
  writingHeavy?: "yes" | "no" | "unclear";
  readingHeavy?: "yes" | "no" | "unclear";
  discussionBased?: "yes" | "no" | "unclear";
  presentationHeavy?: "yes" | "no" | "unclear";
  examHeavy?: "yes" | "no" | "unclear";
}

export interface Course {
  courseCode: string;
  courseName: string;
  verified: VerifiedFields;
  estimated: EstimatedFields;
  verificationStatus: VerificationStatus;
  missingFields: string[];
}

export interface CourseDataset {
  meta: Record<string, unknown>;
  courses: Course[];
}

export interface Interest {
  id: string;
  label: string;
  category: string;
}

export type MinorVerificationStatus = "VERIFIED" | "PARTIAL" | "NEEDS_VERIFICATION";

export interface MinorElectiveGroup {
  chooseCount: number;
  options: string[];
}

export interface Minor {
  name: string;
  slug: string;
  sourceUrl: string;
  calendarEdition: string;
  requiredCourses: string[];
  electiveGroups: MinorElectiveGroup[];
  programExclusions: string[];
  notes: string | null;
  verificationStatus: MinorVerificationStatus;
}

export interface MinorsDataset {
  meta: Record<string, unknown>;
  minors: Minor[];
}

export interface MinorCreditEntry {
  minorName: string;
  minorSlug: string;
  role: "required" | "elective_option";
  chooseCount: number | null;
  optionPoolSize: number | null;
  sourceUrl: string;
}

export interface MinorCreditDataset {
  generatedAt: string;
  byCourse: Record<string, MinorCreditEntry[]>;
  byMinor: Record<
    string,
    {
      minorName: string;
      sourceUrl: string;
      requiredMatches: string[];
      electiveMatches: { courseCode: string; chooseCount: number; optionPoolSize: number }[];
    }
  >;
}

export interface RecommendationResult {
  course: Course;
  score: number; // 0-100
  matchedInterests: Interest[];
  /** Always true now that scoring only reads curated estimated.interestTags. */
  usedResearchedTags: boolean;
}

/**
 * Minimal shape the shared scoring engine (lib/matching.ts) needs from any
 * dataset. Each dataset (courses, groups, ...) adapts its own records into
 * this shape rather than changing its native type.
 */
export interface Recommendable {
  id: string;
  name: string;
  description: string;
  interestTags: string[];
}

export interface ScoredResult<T = Recommendable> {
  item: T;
  score: number; // 0-100
  matchedInterests: Interest[];
}

export type GroupCategory = "design_team" | "student_group" | "student_government";
export type GroupType = "chapter" | "course_union" | "interest_group" | null;
export type GroupAudience = "engineering" | "architecture" | "all_feas";
export type GroupVerificationStatus = "VERIFIED" | "PARTIAL" | "NEEDS_VERIFICATION";

export interface GroupEstimatedFields {
  interestTags: string[];
}

export interface GroupRecord {
  id: string;
  name: string;
  category: GroupCategory;
  pageSection: string;
  groupType: GroupType;
  discipline: string;
  audience: GroupAudience;
  description: string;
  contactEmail: string | null;
  website: string | null;
  sourceUrl: string;
  verificationStatus: GroupVerificationStatus;
  dataIssues: string[];
  /** True only when a dataIssue is specifically about the listed contact
   * being wrong or likely stale (not for unrelated notes like a typo or a
   * missing email) — this is what GroupCard uses to decide whether to warn
   * the student about the contact. */
  contactMayBeOutdated: boolean;
  isAutomaticMembership: boolean;
  isUmbrella: boolean;
  estimated: GroupEstimatedFields;
}

export interface GroupsDataset {
  meta: Record<string, unknown>;
  startYourOwn: {
    engineering: string;
    architecture: string;
    techBased: string;
  };
  groups: GroupRecord[];
}
