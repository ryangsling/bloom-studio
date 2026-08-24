export interface PulsingDotProps {
  color?: string;
  size?: number;
  durationMs?: number;
  className?: string;
}

/** DESIGN.md motion.pulse_ring: scale 1→2, opacity .55→0, 2-2.4s ease-out infinite. */
export function PulsingDot({
  color = "var(--color-status-online)",
  size = 10,
  durationMs = 2000,
  className = "",
}: PulsingDotProps) {
  return (
    <span
      className={`relative inline-block flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rounded-full" style={{ background: color }} />
      <span
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: color, animation: `pulse-ring ${durationMs}ms ease-out infinite` }}
      />
    </span>
  );
}

export default PulsingDot;
