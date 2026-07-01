import type { Connection, Thought } from "../types";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "so", "of", "to", "in",
  "on", "for", "with", "at", "by", "from", "up", "about", "into", "over",
  "after", "is", "are", "was", "were", "be", "been", "being", "it", "its",
  "this", "that", "these", "those", "i", "you", "he", "she", "we", "they",
  "my", "our", "your", "their", "me", "us", "them", "do", "does", "did",
  "have", "has", "had", "will", "would", "could", "should", "can", "may",
  "might", "not", "no", "yes", "as", "than", "too", "very", "just", "feels",
  "feel", "keep", "keeps", "what", "how", "why", "when", "where", "which",
]);

/** Extract meaningful, lowercase keyword tokens from a thought's content. */
export function tokenize(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w)),
    ),
  );
}

/**
 * Build weighted connections between thoughts using the overlap coefficient
 * (shared / smaller keyword set). This works well for short thoughts where a
 * single meaningful shared keyword is a genuine link. Fully deterministic and
 * offline — no API key required.
 */
export function computeConnections(
  thoughts: Thought[],
  threshold = 0.14,
): Connection[] {
  const tokenMap = new Map<string, Set<string>>();
  for (const t of thoughts) tokenMap.set(t.id, new Set(tokenize(t.content)));

  const connections: Connection[] = [];
  for (let i = 0; i < thoughts.length; i++) {
    for (let j = i + 1; j < thoughts.length; j++) {
      const a = tokenMap.get(thoughts[i].id)!;
      const b = tokenMap.get(thoughts[j].id)!;
      if (a.size === 0 || b.size === 0) continue;
      const shared = [...a].filter((w) => b.has(w));
      if (shared.length === 0) continue;
      const overlap = shared.length / Math.min(a.size, b.size);
      if (overlap >= threshold) {
        connections.push({
          source: thoughts[i].id,
          target: thoughts[j].id,
          weight: Math.min(1, overlap),
          shared,
        });
      }
    }
  }
  return connections;
}

/** Count how many connections each thought participates in. */
export function degreeMap(connections: Connection[]): Map<string, number> {
  const deg = new Map<string, number>();
  for (const c of connections) {
    deg.set(c.source, (deg.get(c.source) ?? 0) + 1);
    deg.set(c.target, (deg.get(c.target) ?? 0) + 1);
  }
  return deg;
}

/** The most frequent keywords across all thoughts, with counts. */
export function topKeywords(
  thoughts: Thought[],
  limit = 8,
): { word: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const t of thoughts) {
    for (const w of tokenize(t.content)) {
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, c]) => c > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}
