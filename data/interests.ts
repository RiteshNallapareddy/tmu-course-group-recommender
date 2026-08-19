import { Interest } from "@/lib/types";

/**
 * The researched 36-interest taxonomy for TMU Table A liberal studies
 * courses, derived from the actual 121-course dataset (not from generic
 * assumptions about what a liberal studies calendar might contain). Every
 * interest here has at least one course in data/tmu_table_a_liberals.json
 * genuinely tagged to it via course.estimated.interestTags — see that
 * file and lib/recommendation.ts for how matching works.
 */
export const INTERESTS: Interest[] = [
  { id: "world-history", label: "World History", category: "History" },
  { id: "canadian-history", label: "Canadian History", category: "History" },
  { id: "ancient-civilizations", label: "Ancient Civilizations", category: "History" },
  { id: "caribbean-regional-history", label: "Caribbean History", category: "History" },
  { id: "history-of-science-technology", label: "History of Science & Tech", category: "History" },
  { id: "food-history-culture", label: "Food Culture", category: "History" },

  { id: "sociology-society", label: "Sociology", category: "Society & Identity" },
  { id: "crime-deviance-justice", label: "Crime & Justice", category: "Society & Identity" },
  { id: "social-justice-inequality", label: "Social Justice", category: "Society & Identity" },
  { id: "gender-sexuality-studies", label: "Gender & Sexuality", category: "Society & Identity" },
  { id: "indigenous-studies-cultures", label: "Indigenous Studies", category: "Society & Identity" },
  { id: "psychology-human-behaviour", label: "Psychology", category: "Society & Identity" },

  { id: "global-issues-international-affairs", label: "Global Issues", category: "Global Studies" },
  { id: "geography-globalization-cities", label: "Geography & Cities", category: "Global Studies" },

  { id: "philosophy-big-questions", label: "Philosophy", category: "Philosophy & Religion" },
  { id: "ethics-freedom-justice", label: "Ethics", category: "Philosophy & Religion" },
  { id: "critical-thinking-logic", label: "Critical Thinking", category: "Philosophy & Religion" },
  { id: "philosophy-of-technology", label: "Tech Philosophy", category: "Philosophy & Religion" },
  { id: "aesthetics-philosophy-of-art", label: "Philosophy of Art", category: "Philosophy & Religion" },
  { id: "world-religions", label: "World Religions", category: "Philosophy & Religion" },

  { id: "creativity-innovation", label: "Creativity & Innovation", category: "Ideas & Culture" },

  { id: "world-languages", label: "World Languages", category: "Language & Communication" },
  { id: "language-linguistics-identity", label: "Language & Linguistics", category: "Language & Communication" },
  { id: "communication-media-studies", label: "Communication Studies", category: "Language & Communication" },

  { id: "literature-storytelling", label: "Literature", category: "Arts & Literature" },
  { id: "music-history-global-traditions", label: "Music History", category: "Arts & Literature" },
  { id: "film-studies", label: "Film Studies", category: "Arts & Literature" },
  { id: "visual-art", label: "Visual Art", category: "Arts & Literature" },
  { id: "theatre-performance", label: "Theatre", category: "Arts & Literature" },

  { id: "pop-culture-digital-media", label: "Pop Culture & Media", category: "Media & Pop Culture" },
  { id: "video-games-interactive-culture", label: "Video Games", category: "Media & Pop Culture" },
  { id: "hip-hop-music-culture", label: "Hip Hop Culture", category: "Media & Pop Culture" },

  { id: "environment-sustainability", label: "Environment & Sustainability", category: "Environment & Science" },
  { id: "public-health-society", label: "Public Health", category: "Environment & Science" },

  { id: "economics-markets", label: "Economics", category: "Business & Economics" },
  { id: "financial-markets-investing", label: "Financial Markets", category: "Business & Economics" },
];

export const MAX_INTERESTS = 3;
