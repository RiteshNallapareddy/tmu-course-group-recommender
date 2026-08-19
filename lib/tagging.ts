import { Interest } from "./types";
import { INTERESTS } from "@/data/interests";

export function interestsById(ids: string[]): Interest[] {
  return ids
    .map((id) => INTERESTS.find((i) => i.id === id))
    .filter((i): i is Interest => Boolean(i));
}
