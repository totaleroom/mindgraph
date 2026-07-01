import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { THOUGHT_TYPES, TYPE_META, type Thought, type ThoughtType } from "../types";
import { ThoughtCard } from "./ThoughtCard";

interface Props {
  thoughts: Thought[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<Pick<Thought, "content" | "type" | "done">>) => void;
  onRemove: (id: string) => void;
}

export function ThoughtList({ thoughts, selectedId, onSelect, onUpdate, onRemove }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ThoughtType | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return thoughts.filter((t) => {
      if (filter !== "all" && t.type !== filter) return false;
      if (q && !t.content.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [thoughts, query, filter]);

  return (
    <div className="flex flex-col gap-4 min-h-0">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search thoughts…"
          aria-label="Search thoughts"
          className="w-full bg-surface-container-low border-2 border-primary pl-9 pr-3 py-2 font-manrope text-sm outline-none focus:hard-shadow-sm"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        {THOUGHT_TYPES.map((t) => (
          <FilterChip
            key={t}
            label={TYPE_META[t].label}
            color={TYPE_META[t].color}
            active={filter === t}
            onClick={() => setFilter(t)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 min-h-0">
        {filtered.length === 0 ? (
          <p className="font-manrope text-sm text-secondary py-8 text-center border-2 border-dashed border-outline">
            {thoughts.length === 0
              ? "No thoughts yet. Capture your first one above."
              : "No thoughts match your filter."}
          </p>
        ) : (
          filtered.map((t) => (
            <ThoughtCard
              key={t.id}
              thought={t}
              active={t.id === selectedId}
              onSelect={() => onSelect(t.id === selectedId ? null : t.id)}
              onUpdate={(patch) => onUpdate(t.id, patch)}
              onRemove={() => onRemove(t.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`font-epilogue font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 border-2 border-primary ${
        active ? "hard-shadow-sm" : "opacity-60"
      }`}
      style={{ backgroundColor: active && color ? color : active ? "var(--color-primary)" : "transparent", color: active && !color ? "#fff" : "#000" }}
    >
      {label}
    </button>
  );
}
