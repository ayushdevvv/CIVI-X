import { classNames } from "../utils/helpers";
import { SEVERITY_COLORS, STATUS_COLORS } from "../utils/constants";

export function SeverityBadge({ severity, className = "" }) {
  const color = SEVERITY_COLORS[severity] || "#8A93A8";
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        className
      )}
      style={{
        color,
        borderColor: `${color}33`,
        backgroundColor: `${color}14`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {severity}
    </span>
  );
}

export function StatusBadge({ status, className = "" }) {
  const color = STATUS_COLORS[status] || "#8A93A8";
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        className
      )}
      style={{
        color,
        borderColor: `${color}33`,
        backgroundColor: `${color}14`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  );
}

export function PriorityScore({ score, size = "md" }) {
  const tone =
    score >= 75 ? "critical" : score >= 55 ? "high" : score >= 35 ? "medium" : "low";
  const color = SEVERITY_COLORS[tone.charAt(0).toUpperCase() + tone.slice(1)];
  const dims = size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm";

  return (
    <div
      className={classNames(
        "flex flex-shrink-0 items-center justify-center rounded-full border font-bold",
        dims
      )}
      style={{ color, borderColor: `${color}44`, backgroundColor: `${color}14` }}
      title={`Priority score: ${score}/100`}
    >
      {score}
    </div>
  );
}

export function CategoryPill({ category, className = "" }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/70",
        className
      )}
    >
      {category}
    </span>
  );
}
