import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Minus, Network, Plus } from "lucide-react";
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
const MIN_K = 0.4;
const MAX_K = 4;
const TAP_SLOP = 5; // px of movement still considered a tap

interface Pos {
  x: number;
  y: number;
}
interface Node extends Pos {
  id: string;
  vx: number;
  vy: number;
}
interface Transform {
  x: number;
  y: number;
  k: number;
}

function seed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return (Math.abs(h) % 1000) / 1000;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function layout(thoughts: Thought[], connections: Connection[]): Map<string, Pos> {
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

  const iterations = 300;
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
        a.vx += (dx / dist) * force;
        a.vy += (dy / dist) * force;
        b.vx -= (dx / dist) * force;
        b.vy -= (dy / dist) * force;
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
      a.vx += (dx / dist) * force;
      a.vy += (dy / dist) * force;
      b.vx -= (dx / dist) * force;
      b.vy -= (dy / dist) * force;
    }
    for (const node of nodes.values()) {
      node.vx += (W / 2 - node.x) * center;
      node.vy += (H / 2 - node.y) * center;
      node.vx *= damping;
      node.vy *= damping;
      node.x = clamp(node.x + node.vx, 40, W - 40);
      node.y = clamp(node.y + node.vy, 40, H - 40);
    }
  }

  const out = new Map<string, Pos>();
  for (const [id, node] of nodes) out.set(id, { x: node.x, y: node.y });
  return out;
}

export function Graph({ thoughts, connections, selectedId, onSelect }: Props) {
  const baseLayout = useMemo(() => layout(thoughts, connections), [thoughts, connections]);
  const deg = useMemo(() => degreeMap(connections), [connections]);
  const [overrides, setOverrides] = useState<Map<string, Pos>>(new Map());
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, k: 1 });
  const [gesturing, setGesturing] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const pointers = useRef(new Map<number, Pos>());
  const gesture = useRef<{
    mode: "none" | "pan" | "node" | "pinch";
    nodeId?: string;
    moved: boolean;
    start?: Pos;
    lastDist?: number;
  }>({ mode: "none", moved: false });

  const pos = useCallback(
    (id: string): Pos => overrides.get(id) ?? baseLayout.get(id) ?? { x: W / 2, y: H / 2 },
    [overrides, baseLayout],
  );

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

  const toViewBox = useCallback((clientX: number, clientY: number): Pos => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * W,
      y: ((clientY - rect.top) / rect.height) * H,
    };
  }, []);

  const zoomAround = useCallback((center: Pos, factor: number) => {
    setTransform((t) => {
      const k = clamp(t.k * factor, MIN_K, MAX_K);
      const ratio = k / t.k;
      return {
        k,
        x: center.x - (center.x - t.x) * ratio,
        y: center.y - (center.y - t.y) * ratio,
      };
    });
  }, []);

  // Non-passive wheel listener so we can preventDefault and zoom to cursor.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAround(toViewBox(e.clientX, e.clientY), e.deltaY < 0 ? 1.12 : 1 / 1.12);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [toViewBox, zoomAround]);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setGesturing(true);

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = {
        mode: "pinch",
        moved: true,
        lastDist: Math.hypot(a.x - b.x, a.y - b.y),
      };
      return;
    }
    const el = (e.target as Element).closest?.("[data-node]");
    const nodeId = el?.getAttribute("data-node") ?? undefined;
    gesture.current = {
      mode: nodeId ? "node" : "pan",
      nodeId,
      moved: false,
      start: { x: e.clientX, y: e.clientY },
    };
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const rect = svgRef.current!.getBoundingClientRect();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;

    if (g.mode === "pinch" && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = toViewBox((a.x + b.x) / 2, (a.y + b.y) / 2);
      if (g.lastDist) zoomAround(mid, dist / g.lastDist);
      g.lastDist = dist;
      return;
    }

    if (g.mode === "node" && g.nodeId) {
      const vb = toViewBox(e.clientX, e.clientY);
      const world = { x: (vb.x - transform.x) / transform.k, y: (vb.y - transform.y) / transform.k };
      const id = g.nodeId;
      setOverrides((m) => new Map(m).set(id, world));
      if (g.start && Math.hypot(e.clientX - g.start.x, e.clientY - g.start.y) > TAP_SLOP) g.moved = true;
      return;
    }

    if (g.mode === "pan") {
      const dx = ((e.clientX - prev.x) / rect.width) * W;
      const dy = ((e.clientY - prev.y) / rect.height) * H;
      setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
      if (g.start && Math.hypot(e.clientX - g.start.x, e.clientY - g.start.y) > TAP_SLOP) g.moved = true;
    }
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);

    if (g.mode === "node" && !g.moved && g.nodeId) {
      onSelect(g.nodeId === selectedId ? null : g.nodeId);
    } else if (g.mode === "pan" && !g.moved) {
      onSelect(null);
    }

    if (pointers.current.size === 1) {
      // Dropping from a pinch to a single finger → continue panning.
      const [id] = [...pointers.current.keys()];
      const p = pointers.current.get(id)!;
      gesture.current = { mode: "pan", moved: true, start: { x: p.x, y: p.y } };
    } else if (pointers.current.size === 0) {
      gesture.current = { mode: "none", moved: false };
      setGesturing(false);
    }
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, k: 1 });
    setOverrides(new Map());
  };

  if (thoughts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-center text-secondary p-6">
        <Network className="w-10 h-10" />
        <p className="font-manrope text-sm max-w-xs">
          Your knowledge graph will appear here as you capture thoughts.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full block touch-none select-none"
        role="img"
        aria-label="Interactive knowledge graph. Drag to pan, pinch or scroll to zoom, drag nodes to arrange."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <g
          transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}
          style={{
            transition: gesturing ? "none" : "transform 0.18s ease-out",
            willChange: "transform",
          }}
        >
          {connections.map((c, i) => {
            const a = pos(c.source);
            const b = pos(c.target);
            const highlighted = selectedId && (c.source === selectedId || c.target === selectedId);
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
                style={{ pointerEvents: "none" }}
              />
            );
          })}

          {thoughts.map((t) => {
            const p = pos(t.id);
            const d = deg.get(t.id) ?? 0;
            const radius = 16 + Math.min(d, 6) * 3;
            const dim = selectedId && t.id !== selectedId && !neighbors.has(t.id);
            const isSel = t.id === selectedId;
            return (
              <g
                key={t.id}
                data-node={t.id}
                transform={`translate(${p.x} ${p.y})`}
                opacity={dim ? 0.3 : 1}
                style={{ cursor: "grab" }}
              >
                {/* Larger invisible hit area for comfortable touch targets. */}
                <circle r={radius + 14} fill="transparent" />
                <circle
                  r={radius}
                  fill={TYPE_META[t.type].color}
                  stroke="#000000"
                  strokeWidth={isSel ? 4 : 2}
                />
                <text
                  y={radius + 15}
                  textAnchor="middle"
                  className="font-manrope"
                  fontSize={12}
                  fill="#000000"
                  style={{ pointerEvents: "none" }}
                >
                  {t.content.length > 24 ? t.content.slice(0, 23) + "…" : t.content}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        <ZoomButton label="Zoom in" onClick={() => zoomAround({ x: W / 2, y: H / 2 }, 1.25)}>
          <Plus className="w-4 h-4" />
        </ZoomButton>
        <ZoomButton label="Zoom out" onClick={() => zoomAround({ x: W / 2, y: H / 2 }, 1 / 1.25)}>
          <Minus className="w-4 h-4" />
        </ZoomButton>
        <ZoomButton label="Reset view" onClick={resetView}>
          <Maximize2 className="w-4 h-4" />
        </ZoomButton>
      </div>

      <p className="absolute bottom-3 left-3 font-manrope text-[11px] text-secondary/80 pointer-events-none select-none max-w-[60%]">
        Drag to pan · pinch/scroll to zoom · drag nodes to arrange
      </p>
    </div>
  );
}

function ZoomButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center bg-surface border-2 border-primary hard-shadow-sm lift-interaction"
    >
      {children}
    </button>
  );
}
