import type { Connection, Thought } from "../types";
import { degreeMap, topKeywords } from "./connections";

/**
 * Generate a "Weekly Synthesis" style report entirely offline. Deterministic
 * and always available so the core experience works without any API key.
 */
export function localSynthesis(
  thoughts: Thought[],
  connections: Connection[],
): string {
  if (thoughts.length === 0) {
    return "Capture a few thoughts and MindGraph will start surfacing patterns here.";
  }

  const byType = thoughts.reduce<Record<string, number>>((acc, t) => {
    acc[t.type] = (acc[t.type] ?? 0) + 1;
    return acc;
  }, {});

  const keywords = topKeywords(thoughts, 5);
  const deg = degreeMap(connections);
  const mostConnected = [...deg.entries()].sort((a, b) => b[1] - a[1])[0];
  const hub = mostConnected
    ? thoughts.find((t) => t.id === mostConnected[0])
    : undefined;

  const lines: string[] = [];
  lines.push(
    `You captured ${thoughts.length} thoughts this week` +
      `${keywords.length ? `, most often about ${keywords.map((k) => `“${k.word}”`).join(", ")}.` : "."}`,
  );

  const typeSummary = Object.entries(byType)
    .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
    .join(", ");
  lines.push(`The mix breaks down into ${typeSummary}.`);

  if (connections.length > 0) {
    lines.push(
      `MindGraph found ${connections.length} connection${connections.length > 1 ? "s" : ""} between your thoughts.`,
    );
  }
  if (hub) {
    lines.push(
      `Your central theme right now: “${truncate(hub.content, 90)}” — it links to more thoughts than anything else.`,
    );
  }

  const worries = thoughts.filter((t) => t.type === "worry");
  if (worries.length >= 2) {
    lines.push(
      `Heads up: ${worries.length} worries recurred. Consider turning one into a concrete task.`,
    );
  }

  return lines.join("\n\n");
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

export function buildSynthesisPrompt(thoughts: Thought[]): string {
  const list = thoughts
    .map((t, i) => `${i + 1}. [${t.type}] ${t.content}`)
    .join("\n");
  return (
    "You are MindGraph, a thinking companion. Below is a list of a user's raw " +
    "thoughts, each tagged as an idea, worry, task, or insight. Write a concise, " +
    "warm 'Weekly Synthesis' (max ~150 words). Surface non-obvious connections " +
    "between thoughts, name recurring themes, and suggest one gentle next step. " +
    "Use short paragraphs, no markdown headers.\n\nThoughts:\n" +
    list
  );
}
