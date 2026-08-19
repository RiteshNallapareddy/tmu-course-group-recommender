import { Interest } from "@/lib/types";

/**
 * ⚠️ PROTOTYPE / TEMPORARY DATA ⚠️
 *
 * This is a placeholder ~50-interest taxonomy for demo purposes only.
 * It will be replaced by the professionally researched ~60-interest
 * taxonomy (Milestone 2 of the project). The `keywords` field on each
 * interest exists ONLY so lib/tagging.ts can guess course matches from
 * course descriptions until real per-course interest tags exist.
 *
 * Nothing here should be treated as verified or final. When the real
 * taxonomy lands, this file gets swapped out — the app itself does not
 * need to change (see lib/recommendation.ts).
 */
export const INTERESTS: Interest[] = [
  { id: "ai", label: "Artificial Intelligence", category: "Tech & Science", keywords: ["artificial intelligence", "algorithm", "ai"] },
  { id: "video-games", label: "Video Games", category: "Pop Culture", keywords: ["video game", "games", "gaming", "gamification"] },
  { id: "space", label: "Space", category: "Tech & Science", keywords: ["astronomy", "space", "galaxy", "universe", "planet"] },
  { id: "psychology", label: "Psychology", category: "Society & Mind", keywords: ["psychology", "cognition", "cognitive", "human behaviour", "human behavior"] },
  { id: "human-behaviour", label: "Human Behaviour", category: "Society & Mind", keywords: ["human behaviour", "human behavior"] },
  { id: "crime", label: "Crime", category: "Society & Mind", keywords: ["crime", "criminology", "criminal", "justice"] },
  { id: "true-crime", label: "True Crime", category: "Pop Culture", keywords: ["crime", "forensic", "investigation", "true crime"] },
  { id: "movies", label: "Movies", category: "Pop Culture", keywords: ["film", "cinema", "movie"] },
  { id: "music", label: "Music", category: "Arts", keywords: ["music", "song", "composition", "musical"] },
  { id: "storytelling", label: "Storytelling", category: "Arts", keywords: ["story", "narrative", "storytelling", "literature", "fiction"] },
  { id: "history", label: "History", category: "History & Culture", keywords: ["history", "historical"] },
  { id: "ancient-civilizations", label: "Ancient Civilizations", category: "History & Culture", keywords: ["ancient", "greece", "rome", "roman", "greek", "antiquity"] },
  { id: "canadian-history", label: "Canadian History", category: "History & Culture", keywords: ["canada", "canadian"] },
  { id: "indigenous-cultures", label: "Indigenous Cultures", category: "History & Culture", keywords: ["indigenous", "haudenosaunee", "kanyen", "mohawk", "decoloniz"] },
  { id: "politics", label: "Politics", category: "Society & Mind", keywords: ["politic", "government", "policy", "governance"] },
  { id: "economics", label: "Economics", category: "Business & Society", keywords: ["economic", "economy", "market"] },
  { id: "investing", label: "Investing", category: "Business & Society", keywords: ["financial market", "investing", "stock", "invest"] },
  { id: "financial-markets", label: "Financial Markets", category: "Business & Society", keywords: ["financial market", "stock", "crash", "bubble", "banking"] },
  { id: "food", label: "Food", category: "Lifestyle", keywords: ["food", "cuisine", "culinary", "restaurant"] },
  { id: "travel", label: "Travel", category: "Lifestyle", keywords: ["travel", "tourism", "global", "world"] },
  { id: "architecture", label: "Architecture", category: "Arts", keywords: ["architecture", "architectural", "building", "urban design"] },
  { id: "environment", label: "Environment", category: "Tech & Science", keywords: ["environment", "ecological", "ecosystem", "sustainab", "climate"] },
  { id: "climate-change", label: "Climate Change", category: "Tech & Science", keywords: ["climate", "environment", "sustainab"] },
  { id: "sustainability", label: "Sustainability", category: "Tech & Science", keywords: ["sustainab", "conservation", "environment"] },
  { id: "philosophy", label: "Philosophy", category: "Ideas & Ethics", keywords: ["philosophy", "philosophical"] },
  { id: "ethics", label: "Ethics", category: "Ideas & Ethics", keywords: ["ethic", "moral", "authority", "freedom", "equality"] },
  { id: "religion", label: "Religion", category: "Ideas & Ethics", keywords: ["religio", "faith", "sacred", "spiritual", "hinduism", "buddhism", "islam", "christianity", "judaism", "sikhism"] },
  { id: "art", label: "Art", category: "Arts", keywords: ["art", "visual art", "creative", "aesthetic", "beauty"] },
  { id: "theatre", label: "Theatre", category: "Arts", keywords: ["theatre", "theater", "performance", "drama"] },
  { id: "comics", label: "Comics", category: "Pop Culture", keywords: ["comic", "graphic", "visual rhetoric"] },
  { id: "literature", label: "Literature", category: "Arts", keywords: ["literature", "literary", "novel", "poet", "writing"] },
  { id: "languages", label: "Languages", category: "Culture", keywords: ["language", "vocabulary", "linguistic", "communication"] },
  { id: "communication", label: "Communication", category: "Culture", keywords: ["communicat", "media", "rhetoric"] },
  { id: "technology", label: "Technology", category: "Tech & Science", keywords: ["technology", "technological"] },
  { id: "innovation", label: "Innovation", category: "Tech & Science", keywords: ["innovation", "entrepreneur"] },
  { id: "science", label: "Science", category: "Tech & Science", keywords: ["science", "scientific"] },
  { id: "biology", label: "Biology", category: "Tech & Science", keywords: ["biology", "biological", "genome", "living"] },
  { id: "genetics", label: "Genetics", category: "Tech & Science", keywords: ["genome", "genetic", "gene"] },
  { id: "physics", label: "Physics", category: "Tech & Science", keywords: ["physics", "physical"] },
  { id: "astronomy", label: "Astronomy", category: "Tech & Science", keywords: ["astronomy", "space", "galaxy", "planet"] },
  { id: "society", label: "Society", category: "Society & Mind", keywords: ["society", "social", "sociolog"] },
  { id: "culture", label: "Culture", category: "Culture", keywords: ["culture", "cultural"] },
  { id: "social-justice", label: "Social Justice", category: "Society & Mind", keywords: ["justice", "equity", "inequality", "oppression", "rights", "decoloniz"] },
  { id: "critical-thinking", label: "Critical Thinking", category: "Ideas & Ethics", keywords: ["critical thinking", "reasoning", "logic", "argument"] },
  { id: "creativity", label: "Creativity", category: "Arts", keywords: ["creativ", "innovation", "design", "art"] },
  { id: "debate", label: "Debate", category: "Ideas & Ethics", keywords: ["debate", "argument", "critical thinking", "controvers"] },
  { id: "cities", label: "Cities", category: "Society & Mind", keywords: ["city", "cities", "urban"] },
  { id: "global-issues", label: "Global Issues", category: "Society & Mind", keywords: ["global", "world", "international"] },
  { id: "pop-culture", label: "Pop Culture", category: "Pop Culture", keywords: ["popular culture", "pop culture", "media"] },
  { id: "media", label: "Media", category: "Culture", keywords: ["media", "communicat", "film", "journalis"] },
];

export const MAX_INTERESTS = 3;
