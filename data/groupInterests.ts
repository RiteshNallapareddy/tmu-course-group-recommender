import { Interest } from "@/lib/types";

/**
 * Interest taxonomy for FEAS design teams, student groups and student
 * government (data/tmu_student_groups.json) — a separate taxonomy from
 * data/interests.ts because it reflects what this dataset actually
 * contains: what students would build, how they'd spend their time, and
 * which engineering/architecture field a group serves. Every group is
 * tagged from its description only — see estimated.interestTags on each
 * record.
 */
export const GROUP_INTERESTS: Interest[] = [
  { id: "vehicles", label: "Vehicles", category: "What You'd Build" },
  { id: "robots", label: "Robots", category: "What You'd Build" },
  { id: "aircraft-and-rockets", label: "Aircraft & Rockets", category: "What You'd Build" },
  { id: "structures", label: "Structures", category: "What You'd Build" },
  { id: "assistive-tech", label: "Assistive Tech", category: "What You'd Build" },
  { id: "electronics", label: "Electronics", category: "What You'd Build" },

  { id: "competitions", label: "Competitions", category: "How You'd Spend Time" },
  { id: "hands-on-building", label: "Hands-On Building", category: "How You'd Spend Time" },
  { id: "workshops-and-skills", label: "Workshops & Skills", category: "How You'd Spend Time" },
  { id: "networking-and-industry", label: "Networking & Industry", category: "How You'd Spend Time" },
  { id: "advocacy-and-representation", label: "Advocacy & Representation", category: "How You'd Spend Time" },
  { id: "social-and-community", label: "Social & Community", category: "How You'd Spend Time" },
  { id: "outreach", label: "Outreach", category: "How You'd Spend Time" },

  { id: "aerospace", label: "Aerospace", category: "Field" },
  { id: "biomedical", label: "Biomedical", category: "Field" },
  { id: "chemical", label: "Chemical", category: "Field" },
  { id: "civil", label: "Civil", category: "Field" },
  { id: "electrical-and-computer", label: "Electrical & Computer", category: "Field" },
  { id: "mechanical-and-industrial", label: "Mechanical & Industrial", category: "Field" },
  { id: "cross-discipline", label: "Cross-Discipline", category: "Field" },

  {
    id: "community-and-identity-based-groups",
    label: "Community & Identity-Based Groups",
    category: "Community",
  },
];

export const MAX_GROUP_INTERESTS = 3;

export type ProgramId =
  | "aerospace_engineering"
  | "architectural_science"
  | "biomedical_engineering"
  | "chemical_engineering"
  | "civil_engineering"
  | "computer_engineering"
  | "electrical_engineering"
  | "industrial_engineering"
  | "mechanical_engineering"
  | "mechatronics_engineering"
  | "undeclared";

export interface ProgramOption {
  id: ProgramId;
  label: string;
}

/** "What's your program?" options — optional, skippable, used only to boost
 * discipline-specific groups and surface the right course union. */
export const PROGRAM_OPTIONS: ProgramOption[] = [
  { id: "aerospace_engineering", label: "Aerospace Engineering" },
  { id: "architectural_science", label: "Architectural Science" },
  { id: "biomedical_engineering", label: "Biomedical Engineering" },
  { id: "chemical_engineering", label: "Chemical Engineering" },
  { id: "civil_engineering", label: "Civil Engineering" },
  { id: "computer_engineering", label: "Computer Engineering" },
  { id: "electrical_engineering", label: "Electrical Engineering" },
  { id: "industrial_engineering", label: "Industrial Engineering" },
  { id: "mechanical_engineering", label: "Mechanical Engineering" },
  { id: "mechatronics_engineering", label: "Mechatronics Engineering" },
  { id: "undeclared", label: "Undeclared / not sure" },
];

/**
 * Maps each program to the discipline bucket used for score-boosting.
 * Several real programs share one bucket because the source page itself
 * only ever groups them together (e.g. Electrical, Computer and Biomedical
 * Engineering all sit under one "Electrical, Computer, Biomedical
 * Engineering" section) — the bucket names match GroupRecord.discipline
 * exactly.
 */
export const PROGRAM_TO_DISCIPLINE: Record<ProgramId, string | null> = {
  aerospace_engineering: "aerospace_engineering",
  architectural_science: "architecture",
  biomedical_engineering: "electrical_computer_biomedical_engineering",
  chemical_engineering: "chemical_engineering",
  civil_engineering: "civil_engineering",
  computer_engineering: "electrical_computer_biomedical_engineering",
  electrical_engineering: "electrical_computer_biomedical_engineering",
  industrial_engineering: "mechanical_industrial_mechatronics_engineering",
  mechanical_engineering: "mechanical_industrial_mechatronics_engineering",
  mechatronics_engineering: "mechanical_industrial_mechatronics_engineering",
  undeclared: null,
};

/**
 * Maps each program to its exact course union's id in
 * data/tmu_student_groups.json, where one genuinely exists. Civil,
 * Computer, Electrical and Industrial Engineering have no matching course
 * union in the source data — null here, not a guess, so no course-union
 * card is shown for those programs (they still get the discipline boost
 * above).
 */
export const PROGRAM_TO_COURSE_UNION_ID: Record<ProgramId, string | null> = {
  aerospace_engineering: "aerospace-course-union",
  architectural_science: "architecture-course-union-acu",
  biomedical_engineering: "biomedical-engineering-course-union-becu",
  chemical_engineering: "chemical-engineering-course-union-tmuchemu",
  civil_engineering: null,
  computer_engineering: null,
  electrical_engineering: null,
  industrial_engineering: null,
  mechanical_engineering: "mechanical-engineering-course-union-mecu",
  mechatronics_engineering: "mechatronics-course-union-mcu",
  undeclared: null,
};
