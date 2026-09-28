import type { CSSProperties, ReactNode } from "react";

export type QuestionVisual =
  | "mirror_horizontal"
  | "water_reflection"
  | "rotation"
  | "path"
  | "cube"
  | "direction"
  | "grid_rotation"
  | "line_mirror"
  | "arrow_rotation"
  | "coordinate"
  | "nonverbal_grid"
  | "nonverbal_rotation"
  | "nonverbal_mirror"
  | "nonverbal_water"
  | "nonverbal_sequence";

type Props = { type: QuestionVisual; label: string };

const ink = "#17231b";
const orange = "#e98224";
const muted = "#9d9a8e";
const panel = "#f1eadc";

const svgStyle: CSSProperties = { width: "100%", height: "auto", display: "block" };

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <figure className="question-diagram" aria-label={label}>
      <svg viewBox="0 0 640 190" role="img" style={svgStyle}>
        <rect x="0" y="0" width="640" height="190" rx="10" fill={panel} />
        {children}
      </svg>
      <figcaption>Study the diagram, then choose the matching option.</figcaption>
    </figure>
  );
}

function DotGrid({ water = false, horizontal = true }: { water?: boolean; horizontal?: boolean }) {
  return (
    <>
      <rect x="205" y="27" width="230" height="136" rx="5" fill="none" stroke={muted} strokeWidth="2" />
      <path d="M320 27V163 M205 95H435" stroke={muted} strokeWidth="1" strokeDasharray="5 6" />
      <circle cx={horizontal ? 250 : 250} cy={water ? 67 : 59} r="12" fill={orange} />
      <circle cx={horizontal ? 390 : 390} cy={water ? 123 : 131} r="6" fill={ink} opacity=".55" />
      <text x="320" y="19" textAnchor="middle" fill={ink} fontSize="14" fontFamily="monospace">ORIGINAL FIGURE</text>
      {water ? <><path d="M180 95H460" stroke="#478a9b" strokeWidth="4" /><text x="470" y="100" fill="#478a9b" fontSize="12" fontFamily="monospace">WATER LINE</text></> : null}
    </>
  );
}

function Symbols({ water = false, mirror = false }: { water?: boolean; mirror?: boolean }) {
  return (
    <>
      <text x="320" y="50" textAnchor="middle" fill={ink} fontSize="13" fontFamily="monospace">ORIGINAL FIGURE</text>
      <polygon points="255,92 275,72 295,92 275,112" fill={ink} />
      <circle cx="365" cy="92" r="16" fill="none" stroke={orange} strokeWidth="4" />
      <path d="M300 92H340" stroke={muted} strokeWidth="3" strokeDasharray="4 6" />
      {water ? <path d="M210 128H430" stroke="#478a9b" strokeWidth="4" /> : null}
      {water ? <text x="440" y="133" fill="#478a9b" fontSize="12" fontFamily="monospace">WATER</text> : null}
      {mirror ? <path d="M320 24V155" stroke="#478a9b" strokeWidth="3" strokeDasharray="8 7" /> : null}
      {mirror ? <text x="329" y="38" fill="#478a9b" fontSize="12" fontFamily="monospace">MIRROR</text> : null}
      {water ? <g transform="translate(0,88) scale(1,-1)"><polygon points="255,92 275,72 295,92 275,112" fill={ink} opacity=".2" /><circle cx="365" cy="92" r="16" fill="none" stroke={orange} strokeWidth="4" opacity=".2" /></g> : null}
    </>
  );
}

export default function QuestionDiagram({ type, label }: Props) {
  switch (type) {
    case "mirror_horizontal":
      return <Frame label={label}><DotGrid /></Frame>;
    case "water_reflection":
      return <Frame label={label}><DotGrid water /></Frame>;
    case "nonverbal_mirror":
      return <Frame label={label}><Symbols mirror /></Frame>;
    case "nonverbal_water":
      return <Frame label={label}><Symbols water /></Frame>;
    case "nonverbal_grid":
      return <Frame label={label}><text x="320" y="48" textAnchor="middle" fill={ink} fontSize="13" fontFamily="monospace">PATTERN TO COMPLETE</text><circle cx="260" cy="98" r="18" fill={ink} /><circle cx="320" cy="98" r="18" fill="none" stroke={orange} strokeWidth="4" /><circle cx="380" cy="98" r="18" fill={ink} /><text x="428" y="105" fill={orange} fontSize="24">?</text></Frame>;
    case "nonverbal_rotation":
      return <Frame label={label}><text x="320" y="42" textAnchor="middle" fill={ink} fontSize="13" fontFamily="monospace">ROTATE CLOCKWISE 90°</text><polygon points="295,111 320,66 345,111" fill={ink} /><path d="M400 105 A55 55 0 0 0 400 65" fill="none" stroke={orange} strokeWidth="4" markerEnd="url(#arrow)" /><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill={orange} /></marker></defs></Frame>;
    case "nonverbal_sequence":
      return <Frame label={label}><text x="320" y="42" textAnchor="middle" fill={ink} fontSize="13" fontFamily="monospace">ALTERNATING SHAPES</text><rect x="210" y="75" width="70" height="45" fill="none" stroke={ink} strokeWidth="3" /><polygon points="320,120 345,75 370,120" fill="none" stroke={orange} strokeWidth="3" /><circle cx="430" cy="98" r="23" fill="none" stroke={ink} strokeWidth="3" /><text x="500" y="106" fill={orange} fontSize="26">?</text></Frame>;
    case "rotation":
      return <Frame label={label}><text x="320" y="43" textAnchor="middle" fill={ink} fontSize="13" fontFamily="monospace">90° CLOCKWISE ROTATION</text><path d="M290 112V65H335" fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round" /><path d="M405 75 A58 58 0 0 1 365 130" fill="none" stroke={orange} strokeWidth="4" /></Frame>;
    case "path":
      return <Frame label={label}><path d="M220 140V75H370V140" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="220" cy="140" r="9" fill={orange} /><text x="210" y="161" fill={ink} fontSize="13" fontFamily="monospace">START</text><text x="360" y="161" fill={ink} fontSize="13" fontFamily="monospace">END</text></Frame>;
    case "cube":
      return <Frame label={label}><path d="M270 70L345 48L410 82L336 106Z M270 70V135L336 170V106 M336 106V170L410 145V82" fill="none" stroke={ink} strokeWidth="4" /><circle cx="338" cy="76" r="9" fill={orange} /><text x="450" y="106" fill={ink} fontSize="14" fontFamily="monospace">ROLL FORWARD</text></Frame>;
    case "direction":
      return <Frame label={label}><circle cx="320" cy="100" r="52" fill="none" stroke={muted} strokeWidth="2" /><path d="M320 100V45 M320 100H375" stroke={ink} strokeWidth="5" /><path d="M320 45l-8 14h16z M375 100l-14-8v16z" fill={orange} /><text x="310" y="32" fill={ink} fontSize="14">N</text><text x="390" y="105" fill={ink} fontSize="14">E</text></Frame>;
    case "grid_rotation":
      return <Frame label={label}><rect x="250" y="45" width="140" height="110" fill="none" stroke={ink} strokeWidth="3" /><path d="M320 45V155 M250 100H390" stroke={muted} strokeWidth="2" /><rect x="345" y="120" width="25" height="20" fill={orange} /><path d="M440 103 A45 45 0 0 1 410 140" fill="none" stroke={orange} strokeWidth="4" /></Frame>;
    case "line_mirror":
      return <Frame label={label}><path d="M250 135L390 65" stroke={ink} strokeWidth="8" /><path d="M210 100H430" stroke="#478a9b" strokeWidth="3" strokeDasharray="8 7" /><text x="440" y="105" fill="#478a9b" fontSize="12" fontFamily="monospace">MIRROR</text></Frame>;
    case "arrow_rotation":
      return <Frame label={label}><path d="M320 52V142 M320 142l-18-22 M320 142l18-22" stroke={ink} strokeWidth="8" fill="none" strokeLinecap="round" /><path d="M390 120 A65 65 0 0 0 390 70" fill="none" stroke={orange} strokeWidth="4" /></Frame>;
    case "coordinate":
      return <Frame label={label}><path d="M320 35V165 M205 100H435" stroke={muted} strokeWidth="2" /><path d="M320 35l-7 12h14z M435 100l-12-7v14z" fill={orange} /><circle cx="320" cy="100" r="8" fill={ink} /><circle cx="390" cy="60" r="11" fill={orange} /><text x="445" y="106" fill={ink} fontSize="13">E</text><text x="315" y="28" fill={ink} fontSize="13">N</text></Frame>;
    default:
      return null;
  }
}
