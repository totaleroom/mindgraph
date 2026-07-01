import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { THOUGHT_TYPES, TYPE_META, type Thought, type ThoughtType } from "../types";

interface Props {
  thought: Thought;
  active: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<Pick<Thought, "content" | "type" | "done">>) => void;
  onRemove: () => void;
}

function timeAgo(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function ThoughtCard({ thought, active, onSelect, onUpdate, onRemove }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(thought.content);
  const [draftType, setDraftType] = useState<ThoughtType>(thought.type);
  const meta = TYPE_META[thought.type];

  const save = () => {
    if (draft.trim()) onUpdate({ content: draft.trim(), type: draftType });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="bg-surface border-2 border-primary hard-shadow-sm p-4 flex flex-col gap-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          aria-label="Edit thought"
          className="resize-none bg-surface-container-low border-2 border-primary p-2 font-manrope text-sm outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {THOUGHT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setDraftType(t)}
              className="font-epilogue font-bold text-[10px] uppercase tracking-widest px-2 py-1 border-2 border-primary"
              style={{ backgroundColor: t === draftType ? TYPE_META[t].color : "transparent" }}
            >
              {TYPE_META[t].label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={() => setEditing(false)} className="flex items-center gap-1 border-2 border-primary px-3 py-1.5 font-epilogue font-bold text-sm lift-interaction">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button type="button" onClick={save} className="flex items-center gap-1 bg-primary text-on-primary border-2 border-primary px-3 py-1.5 font-epilogue font-bold text-sm lift-interaction">
            <Check className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`group bg-surface border-2 border-primary p-4 flex flex-col gap-2 cursor-pointer transition-all ${
        active ? "hard-shadow-md -translate-x-0.5 -translate-y-0.5" : "hard-shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-epilogue font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 border-2 border-primary"
          style={{ backgroundColor: meta.color }}
        >
          {meta.label}
        </span>
        <div className="flex items-center gap-1">
          <span className="font-manrope text-xs text-secondary mr-1">{timeAgo(thought.createdAt)}</span>
          {thought.type === "task" && (
            <button
              type="button"
              aria-label={thought.done ? "Mark task not done" : "Mark task done"}
              onClick={(e) => { e.stopPropagation(); onUpdate({ done: !thought.done }); }}
              className={`p-1 border-2 border-primary ${thought.done ? "bg-accent-green" : "bg-surface"}`}
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            aria-label="Edit thought"
            onClick={(e) => { e.stopPropagation(); setDraft(thought.content); setDraftType(thought.type); setEditing(true); }}
            className="p-1 border-2 border-primary bg-surface opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Delete thought"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1 border-2 border-primary bg-surface opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className={`font-manrope text-base ${thought.done ? "line-through opacity-50" : ""}`}>
        {thought.content}
      </p>
    </div>
  );
}
