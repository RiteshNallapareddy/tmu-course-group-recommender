import { Interest } from "./types";

/**
 * Resolves interest ids against whatever taxonomy the caller passes in
 * (liberals' INTERESTS, groups' GROUP_INTERESTS, ...) so this stays usable
 * by any recommendation path rather than being tied to one dataset.
 */
export function interestsById(ids: string[], allInterests: Interest[]): Interest[] {
  return ids
    .map((id) => allInterests.find((i) => i.id === id))
    .filter((i): i is Interest => Boolean(i));
}
