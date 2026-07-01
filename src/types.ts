export type ThoughtType = "idea" | "worry" | "task" | "insight";

export interface Thought {
  id: string;
  content: string;
  type: ThoughtType;
  createdAt: number;
  updatedAt: number;
  /** Whether a "task" type thought has been completed. */
  done?: boolean;
}

export interface Connection {
  source: string;
  target: string;
  /** 0..1 strength of the semantic overlap between two thoughts. */
  weight: number;
  /** Shared keywords that produced this connection. */
  shared: string[];
}

export interface Settings {
  apiKey: string;
  model: string;
}

export const THOUGHT_TYPES: ThoughtType[] = ["idea", "worry", "task", "insight"];

export const TYPE_META: Record<
  ThoughtType,
  { label: string; color: string; text: string }
> = {
  idea: { label: "Idea", color: "var(--color-accent-yellow)", text: "#000000" },
  worry: { label: "Worry", color: "var(--color-accent-pink)", text: "#000000" },
  task: { label: "Task", color: "var(--color-accent-green)", text: "#000000" },
  insight: {
    label: "Insight",
    color: "var(--color-accent-purple)",
    text: "#000000",
  },
};

export const DEFAULT_SETTINGS: Settings = {
  apiKey: "",
  model: "gemini-2.5-flash",
};
