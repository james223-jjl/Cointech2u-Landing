import { ACCENT } from "./theme";

type Props = {
  width?: number;
  height?: number;
  accent?: string;
  seed?: number;
};

export default function Sparkline({
  width = 600,
  height = 160,
  accent = ACCENT,
  seed = 1,
}: Props) {
  const points: number[] = [];
  let v = 50;
  let r = seed;
  const rand = () => {
    r = (r * 9301 + 49297) % 233280;
    return r / 233280;
  };
  for (let i = 0; i < 60; i++) {
    v += (rand() - 0.45) * 8;
    v = Math.max(15, Math.min(95, v));
    points.push(v);
  }

  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - (p / 100) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const area = `${path} L${width},${height} L0,${height} Z`;

  // Tip dot at the rightmost data point.
  const lastX = width;
  const lastY = height - (points[points.length - 1] / 100) * height;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      style={{ display: "block" }}
      aria-hidden
    >
        <defs>
          <linearGradient id={`sparkfill-${seed}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`sparkline-${seed}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
            <stop offset="40%" stopColor={accent} stopOpacity="1" />
            <stop offset="100%" stopColor={accent} stopOpacity="1" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g, i) => (
          <line
            key={i}
            x1="0"
            x2={width}
            y1={height * g}
            y2={height * g}
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="2 4"
          />
        ))}
        <path
          className="ct2u-spark-area"
          d={area}
          fill={`url(#sparkfill-${seed})`}
        />
        <path
          className="ct2u-spark-line"
          pathLength={1}
          d={path}
          fill="none"
          stroke={`url(#sparkline-${seed})`}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle
          className="ct2u-tip-halo"
          cx={lastX}
          cy={lastY}
          r="3"
          stroke={accent}
        />
        <circle
          className="ct2u-tip-halo ct2u-tip-halo-2"
          cx={lastX}
          cy={lastY}
          r="3"
          stroke={accent}
        />
        <circle
          className="ct2u-tip-core"
          cx={lastX}
          cy={lastY}
          r="2.5"
          fill={accent}
          style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
        />
    </svg>
  );
}
