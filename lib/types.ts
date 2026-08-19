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

export interface RecommendationResult {
  course: Course;
  score: number; // 0-100
  matchedInterests: Interest[];
  /** Always true now that scoring only reads curated estimated.interestTags. */
  usedResearchedTags: boolean;
}
