import { useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { ArrowLeft, Network, Settings as SettingsIcon, Share2, Sparkles } from "lucide-react";
import { CaptureBar } from "../components/CaptureBar";
import { ThoughtList } from "../components/ThoughtList";
import { Graph } from "../components/Graph";
import { InsightsPanel } from "../components/InsightsPanel";
import { SettingsModal } from "../components/SettingsModal";
import { useThoughts } from "../hooks/useThoughts";
import { useSettings } from "../hooks/useSettings";
import { computeConnections } from "../lib/connections";

interface Props {
  onExit: () => void;
}

type MobileView = "graph" | "list";

export function Workspace({ onExit }: Props) {
  const { thoughts, addThought, updateThought, removeThought, clearAll } = useThoughts();
  const { settings, update } = useSettings();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [view, setView] = useState<MobileView>("graph");

  const connections = useMemo(() => computeConnections(thoughts), [thoughts]);

  return (
    <div className="h-[100dvh] bg-background text-primary flex flex-col overflow-hidden">
      <header className="shrink-0 bg-background border-b-2 border-primary safe-top">
        <div className="flex items-center justify-between h-14 md:h-16 px-3 md:px-6 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={onExit}
              aria-label="Back to home"
              className="w-10 h-10 flex items-center justify-center border-2 border-primary bg-surface lift-interaction"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              <Network className="text-primary w-6 h-6" />
              <span className="font-epilogue text-lg md:text-xl font-extrabold tracking-tighter">MindGraph</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowInsights(true)}
              className="flex items-center gap-2 bg-accent-yellow font-epilogue font-bold text-sm px-3 h-10 border-2 border-primary hard-shadow-sm lift-interaction"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              aria-label="Settings"
              className="w-10 h-10 flex items-center justify-center border-2 border-primary bg-surface hard-shadow-sm lift-interaction"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 max-w-[1600px] w-full mx-auto p-3 md:p-6 flex flex-col gap-3 md:gap-5">
        <CaptureBar onAdd={addThought} />

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Stat value={thoughts.length} label="Thoughts" />
            <Stat value={connections.length} label="Links" />
          </div>
          <SegmentedToggle view={view} onChange={setView} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-4 lg:gap-6 flex-1 min-h-0">
          <section
            className={`${view === "list" ? "flex" : "hidden"} lg:flex flex-col min-h-0`}
          >
            <h2 className="hidden lg:block font-epilogue text-lg font-bold mb-3 uppercase tracking-tight">
              Thoughts
            </h2>
            <ThoughtList
              thoughts={thoughts}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onUpdate={updateThought}
              onRemove={(id) => {
                if (id === selectedId) setSelectedId(null);
                removeThought(id);
              }}
            />
          </section>

          <section
            className={`${view === "graph" ? "flex" : "hidden"} lg:flex flex-col min-h-0`}
          >
            <h2 className="hidden lg:block font-epilogue text-lg font-bold mb-3 uppercase tracking-tight">
              Knowledge Graph
            </h2>
            <div className="flex-1 min-h-[55vh] lg:min-h-0 bg-surface-container-low border-2 border-primary hard-shadow-md overflow-hidden">
              <Graph
                thoughts={thoughts}
                connections={connections}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {showInsights && (
          <InsightsPanel
            thoughts={thoughts}
            connections={connections}
            settings={settings}
            onClose={() => setShowInsights(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            settings={settings}
            onSave={update}
            onClearAll={clearAll}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SegmentedToggle({
  view,
  onChange,
}: {
  view: MobileView;
  onChange: (v: MobileView) => void;
}) {
  const items: { key: MobileView; label: string; icon: React.ReactNode }[] = [
    { key: "graph", label: "Graph", icon: <Network className="w-4 h-4" /> },
    { key: "list", label: "List", icon: <Share2 className="w-4 h-4 rotate-90" /> },
  ];
  return (
    <div className="lg:hidden flex border-2 border-primary hard-shadow-sm bg-surface shrink-0">
      {items.map((it) => {
        const active = view === it.key;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            aria-pressed={active}
            className={`flex items-center gap-1.5 h-10 px-3 font-epilogue font-bold text-sm ${
              active ? "bg-primary text-on-primary" : "bg-surface"
            }`}
          >
            {it.icon}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5 bg-surface border-2 border-primary hard-shadow-sm px-3 py-1.5">
      <span className="font-epilogue text-xl font-extrabold">{value}</span>
      <span className="font-epilogue font-bold text-[10px] uppercase tracking-widest text-secondary">
        {label}
      </span>
    </div>
  );
}
