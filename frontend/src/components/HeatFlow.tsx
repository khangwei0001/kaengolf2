/**
 * HeatFlow — a field of wavy ember contour lines that drift sideways in a
 * seamless loop, like heat streaming off hot metal. Meant for the light
 * sections where sparks would not read; kept low-opacity so it's felt more
 * than seen. Decorative, so aria-hidden; the drift stops under
 * prefers-reduced-motion via the global motion rules.
 */

// Periods all divide the 120-unit panel width, so each line meets its own
// repeat cleanly and the two stacked panels tile without a seam.
const LINES = [
  { y: 12, amp: 5, period: 60, phase: 0 },
  { y: 26, amp: 7, period: 40, phase: 1.2 },
  { y: 40, amp: 6, period: 60, phase: 2.4 },
  { y: 54, amp: 8, period: 30, phase: 0.6 },
  { y: 68, amp: 6, period: 40, phase: 3.0 },
  { y: 82, amp: 7, period: 60, phase: 1.8 },
  { y: 94, amp: 5, period: 30, phase: 2.1 },
];

function wave(y: number, amp: number, period: number, phase: number, width = 120, step = 2) {
  let d = '';
  for (let x = 0; x <= width; x += step) {
    const yy = y + amp * Math.sin((2 * Math.PI * x) / period + phase);
    d += `${x === 0 ? 'M' : 'L'}${x} ${yy.toFixed(2)} `;
  }
  return d.trim();
}

function Panel({ id }: { id: string }) {
  return (
    <svg className="heat-flow-panel" viewBox="0 0 120 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF8A3D" />
          <stop offset="0.5" stopColor="#FF4D17" />
          <stop offset="1" stopColor="#C81E07" />
        </linearGradient>
      </defs>
      {LINES.map((l, i) => (
        <path
          key={i}
          d={wave(l.y, l.amp, l.period, l.phase)}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={1.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export default function HeatFlow({ className = '' }: { className?: string }) {
  return (
    <div className={`heat-flow ${className}`} aria-hidden="true">
      <div className="heat-flow-track">
        <Panel id="heat-flow-a" />
        <Panel id="heat-flow-b" />
      </div>
    </div>
  );
}
