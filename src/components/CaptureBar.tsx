import { useState } from "react";
import { Mic, MicOff, Plus } from "lucide-react";
import { THOUGHT_TYPES, TYPE_META, type ThoughtType } from "../types";
import { useSpeech } from "../hooks/useSpeech";

interface Props {
  onAdd: (content: string, type: ThoughtType) => void;
}

export function CaptureBar({ onAdd }: Props) {
  const [content, setContent] = useState("");
  const [type, setType] = useState<ThoughtType>("idea");
  const { supported, listening, start, stop } = useSpeech((transcript) =>
    setContent((prev) => (prev ? `${prev} ${transcript}` : transcript)),
  );

  const submit = () => {
    if (!content.trim()) return;
    onAdd(content, type);
    setContent("");
  };

  return (
    <div className="bg-surface border-2 border-primary hard-shadow-md p-4 md:p-6 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
          }}
          placeholder="Dump a thought freely… (⌘/Ctrl + Enter to capture)"
          rows={2}
          aria-label="New thought"
          className="flex-1 resize-none bg-surface-container-low border-2 border-primary p-3 font-manrope text-base outline-none focus:hard-shadow-sm"
        />
        {supported && (
          <button
            type="button"
            onClick={listening ? stop : start}
            aria-label={listening ? "Stop voice capture" : "Start voice capture"}
            className={`shrink-0 self-stretch md:self-auto flex items-center justify-center gap-2 px-4 border-2 border-primary font-epilogue font-bold hard-shadow-sm lift-interaction ${
              listening ? "bg-accent-pink" : "bg-surface"
            }`}
          >
            {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="md:hidden">{listening ? "Stop" : "Voice"}</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          {THOUGHT_TYPES.map((t) => {
            const active = t === type;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={active}
                className={`font-epilogue font-bold text-xs uppercase tracking-widest px-3 py-1.5 border-2 border-primary ${
                  active ? "hard-shadow-sm -translate-y-0.5" : "opacity-70"
                }`}
                style={{ backgroundColor: active ? TYPE_META[t].color : "transparent" }}
              >
                {TYPE_META[t].label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!content.trim()}
          className="flex items-center gap-2 bg-primary text-on-primary font-epilogue font-bold px-5 py-2.5 border-2 border-primary hard-shadow-sm lift-interaction disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
        >
          <Plus className="w-5 h-5" />
          Capture
        </button>
      </div>
    </div>
  );
}
