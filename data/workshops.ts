import { WorkshopCategory } from "@/lib/types";

/**
 * Starter categories for the "you may be interested in..." suggestions
 * section (see components/WorkshopSuggestions.tsx). Labels and
 * descriptions are generic/self-evident, but hostName/hostUrl are left
 * null rather than guessed at a specific TMU office or external provider —
 * same "don't invent it, leave it unverified" convention used everywhere
 * else in this app (GroupRecord.contactEmail, Course.verified.* fields,
 * etc.). The UI simply omits the "visit host" link until these are filled
 * in, so add a URL here whenever you confirm one.
 */
export const WORKSHOP_CATEGORIES: WorkshopCategory[] = [
  {
    id: "cad",
    label: "CAD",
    description:
      "Computer-aided design skills for modeling and drafting parts and assemblies.",
    hostName: null,
    hostUrl: null,
  },
  {
    id: "3d-printing",
    label: "3D Printing",
    description:
      "Hands-on skills for designing and printing physical prototypes.",
    hostName: null,
    hostUrl: null,
  },
  {
    id: "leadership",
    label: "Leadership",
    description:
      "Team leadership, project management, and communication skills.",
    hostName: null,
    hostUrl: null,
  },
];
