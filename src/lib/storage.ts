import type { Thought } from "../types";

const THOUGHTS_KEY = "mindgraph.thoughts.v1";
const SETTINGS_KEY = "mindgraph.settings.v1";

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / private-mode errors so the UI never crashes on save.
  }
}

export const KEYS = { THOUGHTS: THOUGHTS_KEY, SETTINGS: SETTINGS_KEY };

/** A small starter set so first-time users immediately see a populated graph. */
export function seedThoughts(): Thought[] {
  const now = Date.now();
  const mk = (
    content: string,
    type: Thought["type"],
    minsAgo: number,
  ): Thought => ({
    id: crypto.randomUUID(),
    content,
    type,
    createdAt: now - minsAgo * 60_000,
    updatedAt: now - minsAgo * 60_000,
  });
  return [
    mk("What if onboarding was a single guided graph instead of a boring form?", "idea", 600),
    mk("Scaling the team is exciting but the infra cost really worries me.", "worry", 480),
    mk("Ship the local-first storage layer before adding any AI features.", "task", 300),
    mk("Users keep mentioning focus and overwhelm when scaling their work.", "insight", 180),
    mk("A weekly digest could resurface forgotten ideas about scaling and focus.", "idea", 90),
    mk("Anxiety spikes before big releases — scaling pressure hits hardest then.", "worry", 30),
  ];
}
