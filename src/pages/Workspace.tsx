import { useMemo, useState } from "react";
import { ArrowLeft, Network, Settings as SettingsIcon, Sparkles } from "lucide-react";
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

export function Workspace({ onExit }: Props) {
  const { thoughts, addThought, updateThought, removeThought, clearAll } = useThoughts();
  const { settings, update } = useSettings();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const connections = useMemo(() => computeConnections(thoughts), [thoughts]);

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col">
      <header className="sticky top-0 z-40 bg-background border-b-2 border-primary">
        <div className="flex items-center justify-between h-16 px-4 md:px-6 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onExit} aria-label="Back to home" className="p-1.5 border-2 border-primary bg-surface lift-interaction">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              <Network className="text-primary w-6 h-6" />
              <span className="font-epilogue text-xl font-extrabold tracking-tighter">MindGraph</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowInsights(true)} className="flex items-center gap-2 bg-accent-yellow font-epilogue font-bold text-sm px-3 py-1.5 border-2 border-primary hard-shadow-sm lift-interaction">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </button>
            <button type="button" onClick={() => setShowSettings(true)} aria-label="Settings" className="p-2 border-2 border-primary bg-surface hard-shadow-sm lift-interaction">
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        <CaptureBar onAdd={addThought} />

        <StatBar count={thoughts.length} connections={connections.length} />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-6 flex-1 min-h-0">
          <section className="flex flex-col min-h-0 lg:max-h-[calc(100vh-320px)]">
            <h2 className="font-epilogue text-lg font-bold mb-3 uppercase tracking-tight">Thoughts</h2>
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

          <section className="flex flex-col min-h-0">
            <h2 className="font-epilogue text-lg font-bold mb-3 uppercase tracking-tight">Knowledge Graph</h2>
            <div className="flex-1 min-h-[420px] bg-surface-container-low border-2 border-primary hard-shadow-md overflow-hidden">
              <Graph
                thoughts={thoughts}
                connections={connections}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          </section>
        </div>
      </div>

      {showInsights && (
        <InsightsPanel
          thoughts={thoughts}
          connections={connections}
          settings={settings}
          onClose={() => setShowInsights(false)}
        />
      )}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={update}
          onClearAll={clearAll}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

function StatBar({ count, connections }: { count: number; connections: number }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Stat value={count} label="Thoughts" />
      <Stat value={connections} label="Connections" />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2 bg-surface border-2 border-primary hard-shadow-sm px-4 py-2">
      <span className="font-epilogue text-2xl font-extrabold">{value}</span>
      <span className="font-epilogue font-bold text-xs uppercase tracking-widest text-secondary">{label}</span>
    </div>
  );
}
