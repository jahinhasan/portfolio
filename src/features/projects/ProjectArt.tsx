import type { ReactNode } from "react";
import type { Project } from "@/types";

/**
 * Generated SVG artwork for projects without a real screenshot.
 *
 * Flat, hard-edged, blueprint-style plates that adapt to the active theme
 * and accent color via CSS variables. Deliberately abstract — these are
 * decorative motifs, not mock screenshots. To use a real screenshot
 * instead, set `screenshot` on the project in src/data/projects.ts.
 */

interface ProjectArtProps {
  project: Project;
  className?: string;
}

export function ProjectArt({ project, className }: ProjectArtProps) {
  return (
    <svg
      viewBox="0 0 400 225"
      role="img"
      aria-label={`${project.name} illustration`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={`grid-${project.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Backdrop */}
      <rect width="400" height="225" fill="var(--surface)" />
      <rect width="400" height="225" fill={`url(#grid-${project.id})`} />

      {renderMotif(project)}

      {/* Corner label */}
      <text
        x="20"
        y="204"
        fontFamily="var(--font-mono)"
        fontSize="11"
        fill="var(--faint)"
        letterSpacing="2"
      >
        {project.id.toUpperCase()}
      </text>
    </svg>
  );
}

function renderMotif(project: Project): ReactNode {
  switch (project.category) {
    case "web":
      return <BrowserWindow variant={project.id === "shopsync" ? "store" : "space"} />;
    case "backend":
      return <Pipeline />;
    case "networking":
      return <GraphNetwork />;
    case "ai-ml":
      return <SnakeGrid />;
    case "automation":
      return <ToolStack variant={project.id} />;
    case "mobile":
      return <PhoneFrame variant={project.id} />;
    case "robotics":
      return <RoverTop />;
  }
}

/** Window chrome used by several motifs — square, hairline borders. */
function WindowChrome({ width }: { width: number }) {
  return (
    <g>
      <rect
        x={(400 - width) / 2}
        y="38"
        width={width}
        height="150"
        fill="var(--raised)"
        stroke="var(--line-strong)"
      />
      <line
        x1={(400 - width) / 2}
        y1="58"
        x2={(400 + width) / 2}
        y2="58"
        stroke="var(--line)"
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={(400 - width) / 2 + 10 + i * 14}
          y="44"
          width="7"
          height="7"
          fill="var(--line-strong)"
        />
      ))}
    </g>
  );
}

function BrowserWindow({ variant }: { variant: "store" | "space" }) {
  const width = 300;
  const left = (400 - width) / 2;
  return (
    <g>
      <WindowChrome width={width} />
      {variant === "store" ? (
        <g>
          <rect x={left + 16} y="70" width="90" height="8" fill="var(--accent)" />
          <rect x={left + 16} y="86" width="60" height="6" fill="var(--line-strong)" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect
                x={left + 16 + (i % 2) * 140}
                y={104 + Math.floor(i / 2) * 38}
                width="130"
                height="30"
                fill="var(--surface)"
                stroke="var(--line-strong)"
              />
              <rect
                x={left + 24 + (i % 2) * 140}
                y={112 + Math.floor(i / 2) * 38}
                width="14"
                height="14"
                fill="var(--accent)"
                opacity={0.35 + i * 0.15}
              />
              <rect
                x={left + 46 + (i % 2) * 140}
                y={114 + Math.floor(i / 2) * 38}
                width={60 - i * 8}
                height="5"
                fill="var(--faint)"
              />
              <rect
                x={left + 46 + (i % 2) * 140}
                y={123 + Math.floor(i / 2) * 38}
                width="30"
                height="4"
                fill="var(--line-strong)"
              />
            </g>
          ))}
        </g>
      ) : (
        <g>
          {/* Planet + ring, hard edges */}
          <circle cx="200" cy="118" r="26" fill="var(--accent)" />
          <rect x="150" y="112" width="100" height="12" fill="none" stroke="var(--accent)" strokeWidth="1.5" transform="rotate(-18 200 118)" />
          {[
            [128, 84, 5],
            [262, 76, 4],
            [290, 132, 6],
            [120, 150, 4],
          ].map(([cx, cy, r], i) => (
            <rect key={i} x={cx! - r!} y={cy! - r!} width={r! * 2} height={r! * 2} fill="var(--line-strong)" />
          ))}
        </g>
      )}
    </g>
  );
}

function Pipeline() {
  const stages = [
    { x: 46, label: "events" },
    { x: 158, label: "assess" },
    { x: 270, label: "gate" },
  ];
  return (
    <g>
      {stages.map((s, i) => (
        <g key={s.label}>
          <rect
            x={s.x}
            y="86"
            width="84"
            height="52"
            fill="var(--raised)"
            stroke={i === 2 ? "var(--accent)" : "var(--line-strong)"}
            strokeWidth={i === 2 ? 1.5 : 1}
          />
          <rect x={s.x + 12} y="98" width="36" height="5" fill="var(--accent)" />
          <rect x={s.x + 12} y="110" width={52 - i * 8} height="4" fill="var(--faint)" />
          <rect x={s.x + 12} y="120" width="40" height="4" fill="var(--line-strong)" />
          <text
            x={s.x + 42}
            y="156"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="10"
            fill="var(--faint)"
          >
            {s.label}
          </text>
        </g>
      ))}
      {stages.slice(0, -1).map((s) => (
        <g key={`arrow-${s.x}`}>
          <rect x={s.x + 88} y="110" width="10" height="3" fill="var(--accent)" />
          <rect x={s.x + 96} y="106" width="3" height="3" fill="var(--accent)" transform={`rotate(45 ${s.x + 97.5} 107.5)`} />
          <rect x={s.x + 96} y="114" width="3" height="3" fill="var(--accent)" transform={`rotate(-45 ${s.x + 97.5} 115.5)`} />
        </g>
      ))}
      <text x="200" y="70" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--faint)" letterSpacing="1.5">
        append-only event log
      </text>
    </g>
  );
}

function GraphNetwork() {
  const nodes: Array<[number, number, number]> = [
    [90, 120, 7],
    [160, 70, 6],
    [200, 135, 8],
    [270, 90, 6],
    [315, 140, 6],
    [250, 165, 5],
  ];
  const edges: Array<[number, number, boolean]> = [
    [0, 1, false],
    [1, 2, false],
    [2, 3, false],
    [3, 4, true],
    [2, 5, false],
    [5, 4, false],
    [0, 2, false],
  ];
  return (
    <g>
      {edges.map(([a, b, routed], i) => {
        const na = nodes[a];
        const nb = nodes[b];
        if (!na || !nb) return null;
        return (
          <line
            key={i}
            x1={na[0]}
            y1={na[1]}
            x2={nb[0]}
            y2={nb[1]}
            stroke={routed ? "var(--accent)" : "var(--line-strong)"}
            strokeWidth={routed ? 2.5 : 1.5}
            strokeDasharray={routed ? "6 4" : undefined}
          />
        );
      })}
      {nodes.map(([cx, cy, r], i) => (
        <g key={i}>
          <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="var(--raised)" stroke="var(--line-strong)" />
          <rect x={cx - 2.5} y={cy - 2.5} width="5" height="5" fill={i === 0 || i === 4 ? "var(--accent)" : "var(--faint)"} />
        </g>
      ))}
      <text x="200" y="62" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--faint)" letterSpacing="1.5">
        shortest path — held-out scenario
      </text>
    </g>
  );
}

function SnakeGrid() {
  const cell = 18;
  const path: Array<[number, number]> = [
    [4, 3],
    [5, 3],
    [6, 3],
    [6, 4],
    [6, 5],
    [5, 5],
    [4, 5],
    [3, 5],
  ];
  return (
    <g>
      <rect x="112" y="42" width="176" height="144" fill="var(--raised)" stroke="var(--line-strong)" />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`v${i}`} x1={112 + (i + 1) * cell} y1="42" x2={112 + (i + 1) * cell} y2="186" stroke="var(--line)" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`h${i}`} x1="112" y1={42 + (i + 1) * cell} x2="288" y2={42 + (i + 1) * cell} stroke="var(--line)" />
      ))}
      {path.map(([gx, gy], i) => (
        <rect
          key={i}
          x={112 + gx * cell + 2}
          y={42 + gy * cell + 2}
          width={cell - 4}
          height={cell - 4}
          fill="var(--accent)"
          opacity={0.35 + (i / path.length) * 0.65}
        />
      ))}
      <rect x={112 + 2 * cell + cell / 2 - 4} y={42 + 2 * cell + cell / 2 - 4} width="8" height="8" fill="var(--ink)" />
      <text x="200" y="205" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--faint)" letterSpacing="1.5">
        episode 100000 · avg score 23
      </text>
    </g>
  );
}

function ToolStack({ variant }: { variant: string }) {
  const rows = [0, 1, 2, 3];
  const isPdf = variant === "pdf-merger-tool";
  return (
    <g>
      <WindowChrome width={280} />
      {isPdf ? (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${108 + i * 70} ${86 + i * 14}) rotate(${-8 + i * 8})`}>
              <rect width="52" height="66" fill="var(--surface)" stroke="var(--line-strong)" />
              <rect x="8" y="10" width="36" height="4" fill="var(--accent)" />
              <rect x="8" y="20" width="28" height="3.5" fill="var(--faint)" />
              <rect x="8" y="28" width="32" height="3.5" fill="var(--faint)" opacity="0.7" />
              <rect x="8" y="36" width="24" height="3.5" fill="var(--faint)" opacity="0.5" />
            </g>
          ))}
          <text x="200" y="176" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--faint)" letterSpacing="1.5">
            merge · split · rotate · encrypt
          </text>
        </g>
      ) : (
        <g>
          {rows.map((i) => (
            <g key={i}>
              <rect x="80" y={72 + i * 24} width="240" height="18" fill="var(--surface)" stroke="var(--line)" />
              <rect x="88" y={77 + i * 24} width="10" height="8" fill="var(--accent)" opacity={0.4 + i * 0.2} />
              <rect x="106" y={78 + i * 24} width={150 - i * 30} height="6" fill="var(--faint)" opacity="0.8" />
              <rect x="290" y={78 + i * 24} width="22" height="6" fill="var(--line-strong)" />
            </g>
          ))}
          <text x="200" y="176" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--faint)" letterSpacing="1.5">
            crawl · parse · export
          </text>
        </g>
      )}
    </g>
  );
}

function PhoneFrame({ variant }: { variant: string }) {
  const isRpg = variant === "rpg-the-student-life";
  return (
    <g>
      <rect x="156" y="36" width="88" height="160" fill="var(--raised)" stroke="var(--line-strong)" />
      <rect x="163" y="48" width="74" height="130" fill="var(--surface)" />
      <rect x="188" y="41" width="24" height="3" fill="var(--line-strong)" />
      {isRpg ? (
        <g>
          <rect x="170" y="56" width="34" height="5" fill="var(--accent)" />
          <rect x="170" y="70" width="60" height="5" fill="var(--line-strong)" />
          <rect x="170" y="80" width="52" height="5" fill="var(--line-strong)" opacity="0.6" />
          {/* XP bar */}
          <rect x="170" y="96" width="60" height="6" fill="var(--line)" />
          <rect x="170" y="96" width="40" height="6" fill="var(--accent)" />
          {/* battle cards */}
          {[0, 1].map((i) => (
            <rect key={i} x={170} y={112 + i * 26} width="60" height="20" fill="var(--raised)" stroke="var(--line-strong)" />
          ))}
          <rect x="178" y="118" width="8" height="8" fill="var(--accent)" />
          <rect x="178" y="144" width="8" height="8" fill="var(--accent)" opacity="0.55" />
        </g>
      ) : (
        <g>
          <rect x="182" y="68" width="36" height="36" fill="var(--accent)" opacity="0.25" />
          <path d="M 194 86 l 4 4 l 8 -8" stroke="var(--accent)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="176" y="112" width="48" height="5" fill="var(--line-strong)" />
          <rect x="182" y="122" width="36" height="5" fill="var(--line)" />
          <rect x="176" y="140" width="48" height="14" fill="var(--accent)" />
          <rect x="176" y="160" width="48" height="14" fill="var(--raised)" stroke="var(--line-strong)" />
        </g>
      )}
    </g>
  );
}

function RoverTop() {
  return (
    <g>
      {/* Detection cone */}
      <path d="M 200 60 L 140 20 L 260 20 Z" fill="var(--accent)" opacity="0.14" />
      {/* Rover body */}
      <rect x="168" y="88" width="64" height="88" fill="var(--raised)" stroke="var(--line-strong)" />
      <rect x="180" y="100" width="40" height="30" fill="var(--surface)" stroke="var(--line)" />
      <circle cx="200" cy="115" r="8" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <rect x="197.5" y="112.5" width="5" height="5" fill="var(--accent)" />
      {/* Wheels */}
      {[-8, 96].flatMap((dy) =>
        [150, 232].map((dx) => (
          <rect
            key={`${dx}-${dy}`}
            x={dx}
            y={88 + dy}
            width="18"
            height="24"
            fill="var(--surface)"
            stroke="var(--line-strong)"
          />
        )),
      )}
      {/* Sonar arcs */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${168 - (i + 1) * 14} 132 A ${(i + 1) * 14} ${(i + 1) * 14} 0 0 1 168 ${132 - (i + 1) * 14}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          opacity={0.7 - i * 0.2}
        />
      ))}
      <text x="200" y="205" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--faint)" letterSpacing="1.5">
        yolo → serial → motors
      </text>
    </g>
  );
}
