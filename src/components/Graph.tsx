import { useMemo } from "react";
import { Network } from "lucide-react";
import type { Connection, Thought } from "../types";
import { TYPE_META } from "../types";
import { degreeMap } from "../lib/connections";

interface Props {
  thoughts: Thought[];
  connections: Connection[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const W = 800;
const H = 600;

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Deterministic pseudo-random from a string id, so layouts are stable. */
function seed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return (Math.abs(h) % 1000) / 1000;
}

function layout(thoughts: Thought[], connections: Connection[]): Map<string, Node> {
  const nodes = new Map<string, Node>();
  const n = thoughts.length;
  thoughts.forEach((t, i) => {
    const angle = (i / Math.max(1, n)) * Math.PI * 2;
    const r = 120 + seed(t.id) * 80;
    nodes.set(t.id, {
      id: t.id,
      x: W / 2 + Math.cos(angle) * r,
      y: H / 2 + Math.sin(angle) * r,
      vx: 0,
      vy: 0,
    });
  });

  const iterations = 320;
  const repulsion = 9000;
  const spring = 0.02;
  const springLen = 130;
  const center = 0.008;
  const damping = 0.85;

  for (let iter = 0; iter < iterations; iter++) {
    const arr = [...nodes.values()];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const a = arr[i];
        const b = arr[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist2 = dx * dx + dy * dy;
        if (dist2 < 0.01) {
          dx = (seed(a.id) - 0.5) * 2;
          dy = (seed(b.id) - 0.5) * 2;
          dist2 = dx * dx + dy * dy;
        }
        const dist = Math.sqrt(dist2);
        const force = repulsion / dist2;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
    }

    for (const c of connections) {
      const a = nodes.get(c.source);
      const b = nodes.get(c.target);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - springLen) * spring;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }

    for (const node of nodes.values()) {
      node.vx += (W / 2 - node.x) * center;
      node.vy += (H / 2 - node.y) * center;
      node.vx *= damping;
      node.vy *= damping;
      node.x += node.vx;
      node.y += node.vy;
      node.x = Math.max(40, Math.min(W - 40, node.x));
      node.y = Math.max(40, Math.min(H - 40, node.y));
    }
  }
  return nodes;
}

export function Graph({ thoughts, connections, selectedId, onSelect }: Props) {
  const nodes = useMemo(() => layout(thoughts, connections), [thoughts, connections]);
  const deg = useMemo(() => degreeMap(connections), [connections]);

  const neighbors = useMemo(() => {
    const set = new Set<string>();
    if (selectedId) {
      for (const c of connections) {
        if (c.source === selectedId) set.add(c.target);
        if (c.target === selectedId) set.add(c.source);
      }
    }
    return set;
  }, [connections, selectedId]);

  if (thoughts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-center text-secondary">
        <Network className="w-10 h-10" />
        <p className="font-manrope text-sm max-w-xs">
          Your knowledge graph will appear here as you capture thoughts.
        </p>
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full"
      role="img"
      aria-label="Knowledge graph of your thoughts"
      onClick={() => onSelect(null)}
    >
      {connections.map((c, i) => {
        const a = nodes.get(c.source)!;
        const b = nodes.get(c.target)!;
        const highlighted =
          selectedId && (c.source === selectedId || c.target === selectedId);
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#000000"
            strokeWidth={highlighted ? 3.5 : 1.75 + c.weight * 3}
            strokeOpacity={selectedId ? (highlighted ? 1 : 0.1) : 0.6}
          />
        );
      })}

      {thoughts.map((t) => {
        const node = nodes.get(t.id)!;
        const d = deg.get(t.id) ?? 0;
        const radius = 16 + Math.min(d, 6) * 3;
        const dim = selectedId && t.id !== selectedId && !neighbors.has(t.id);
        const isSel = t.id === selectedId;
        return (
          <g
            key={t.id}
            transform={`translate(${node.x} ${node.y})`}
            className="cursor-pointer"
            opacity={dim ? 0.3 : 1}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(isSel ? null : t.id);
            }}
          >
            <circle
              r={radius}
              fill={TYPE_META[t.type].color}
              stroke="#000000"
              strokeWidth={isSel ? 4 : 2}
            />
            <text
              y={radius + 14}
              textAnchor="middle"
              className="font-manrope pointer-events-none"
              fontSize={12}
              fill="#000000"
            >
              {t.content.length > 24 ? t.content.slice(0, 23) + "…" : t.content}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
