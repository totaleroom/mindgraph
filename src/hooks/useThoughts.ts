import { useCallback, useEffect, useState } from "react";
import type { Thought, ThoughtType } from "../types";
import { KEYS, loadJSON, saveJSON, seedThoughts } from "../lib/storage";

export function useThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>(() => {
    const stored = loadJSON<Thought[] | null>(KEYS.THOUGHTS, null);
    if (stored && Array.isArray(stored)) return stored;
    const seeded = seedThoughts();
    saveJSON(KEYS.THOUGHTS, seeded);
    return seeded;
  });

  useEffect(() => {
    saveJSON(KEYS.THOUGHTS, thoughts);
  }, [thoughts]);

  const addThought = useCallback((content: string, type: ThoughtType) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    const now = Date.now();
    setThoughts((prev) => [
      {
        id: crypto.randomUUID(),
        content: trimmed,
        type,
        createdAt: now,
        updatedAt: now,
      },
      ...prev,
    ]);
  }, []);

  const updateThought = useCallback(
    (id: string, patch: Partial<Pick<Thought, "content" | "type" | "done">>) => {
      setThoughts((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t,
        ),
      );
    },
    [],
  );

  const removeThought = useCallback((id: string) => {
    setThoughts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => setThoughts([]), []);

  return { thoughts, addThought, updateThought, removeThought, clearAll };
}
