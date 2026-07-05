/**
 * SwingArc — the brand signature.
 * A stroboscopic fan of strobe spokes radiating from a pivot, echoing the
 * Edgerton-style long-exposure golf swing. Each spoke ends in a club-head
 * dot; ember ignites along the spokes in sequence. Drawn parametrically.
 */
interface SwingArcProps {
  /** number of strobe spokes */
  count?: number;
  /** sweep of the fan, in degrees */
  sweep?: number;
  /** rotation offset of the whole fan, in degrees */
  rotate?: number;
  className?: string;
  /** animate the ember ignition */
  animate?: boolean;
  /** let the whole fan sway gently, like an unhurried swing */
  breathe?: boolean;
}

export default function SwingArc({
  count = 26,
  sweep = 200,
  rotate = -10,
  className = '',
  animate = true,
  breathe = false,
}: SwingArcProps) {
  const cx = 200;
  const cy = 200;
  const start = -90 - sweep / 2 + rotate;
  const spokes = Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1);
    const angle = (start + t * sweep) * (Math.PI / 180);
    // length swells through the middle of the swing, like club speed
    const len = 78 + Math.sin(t * Math.PI) * 96;
    const x2 = cx + Math.cos(angle) * len;
    const y2 = cy + Math.sin(angle) * len;
    return { x2, y2, delay: t * 0.9 };
  });

  return (
    <svg
      viewBox="0 0 400 400"
      className={`${animate && breathe ? 'swing-fan ' : ''}${className}`}
      role="img"
      aria-label="Stroboscopic golf swing arc"
      style={{ ['--cx' as string]: cx, ['--cy' as string]: cy }}
    >
      {spokes.map((s, i) => (
        <g key={i}>
          <line
            x1={cx}
            y1={cy}
            x2={s.x2}
            y2={s.y2}
            className={animate ? 'swing-spoke' : undefined}
            stroke={animate ? undefined : 'rgba(245,245,242,0.16)'}
            style={animate ? { animationDelay: `${s.delay}s` } : undefined}
          />
          <circle cx={s.x2} cy={s.y2} r={2.2} fill="rgba(245,245,242,0.34)" />
        </g>
      ))}
      <circle
        cx={cx}
        cy={cy}
        r={4.5}
        fill="#FF4D17"
        className={animate ? 'swing-pivot' : undefined}
      />
    </svg>
  );
}
