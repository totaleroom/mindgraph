import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import type { Connection, Settings, Thought } from "../types";
import { buildSynthesisPrompt, localSynthesis } from "../lib/insights";
import { generateWithGemini } from "../lib/gemini";

interface Props {
  thoughts: Thought[];
  connections: Connection[];
  settings: Settings;
  onClose: () => void;
}

export function InsightsPanel({ thoughts, connections, settings, onClose }: Props) {
  const [report, setReport] = useState<string>(() =>
    localSynthesis(thoughts, connections),
  );
  const [source, setSource] = useState<"local" | "gemini">("local");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAI = async () => {
    setLoading(true);
    setError(null);
    try {
      const text = await generateWithGemini(
        settings.apiKey,
        settings.model,
        buildSynthesisPrompt(thoughts),
      );
      setReport(text);
      setSource("gemini");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to generate AI synthesis.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="bg-surface border-2 border-primary hard-shadow-lg w-full max-w-lg max-h-[85dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        <div className="flex items-center justify-between border-b-2 border-primary p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-epilogue text-xl font-bold">Weekly Synthesis</h2>
          </div>
          <button type="button" aria-label="Close insights" onClick={onClose} className="p-1 border-2 border-primary bg-surface lift-interaction">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <span className="inline-block font-epilogue font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 border-2 border-primary mb-4"
            style={{ backgroundColor: source === "gemini" ? "var(--color-accent-purple)" : "var(--color-accent-green)" }}>
            {source === "gemini" ? "Gemini AI" : "Local engine"}
          </span>
          {report.split("\n\n").map((p, i) => (
            <p key={i} className="font-manrope text-base mb-3 whitespace-pre-wrap">{p}</p>
          ))}
          {error && (
            <p className="font-manrope text-sm text-primary bg-accent-pink border-2 border-primary p-3 mt-2">{error}</p>
          )}
        </div>

        <div className="border-t-2 border-primary p-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={runAI}
            disabled={loading || !settings.apiKey}
            className="flex items-center justify-center gap-2 bg-accent-purple text-primary font-epilogue font-bold py-3 border-2 border-primary hard-shadow-sm lift-interaction disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? "Thinking…" : "Deepen with Gemini AI"}
          </button>
          {!settings.apiKey && (
            <p className="font-manrope text-xs text-secondary text-center">
              Add a Gemini API key in Settings to unlock AI-powered synthesis. The local engine works without a key.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
