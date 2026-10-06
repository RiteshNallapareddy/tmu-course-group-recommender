import { ClubRecord, ClubsDataset } from "./types";
import rawDataset from "@/data/tmu_clubs.json";

const dataset = rawDataset as unknown as ClubsDataset;

/** Every club this app knows about, active or not, read live from the JSON dataset. */
export function getAllClubs(): ClubRecord[] {
  return dataset.clubs;
}

/**
 * Clubs to actually show students. `active` is a deliberate manual flag
 * (not inferred from anything) since the source list of 300+ clubs needs a
 * human pass to confirm which ones are still running — see
 * scripts/import-clubs-csv.mjs.
 */
export function getActiveClubs(): ClubRecord[] {
  return getAllClubs().filter((c) => c.active);
}
