import { motion } from "framer-motion";
import { Building2, Wrench, Tag, Gauge } from "lucide-react";
import { SeverityBadge } from "./Badges";

export default function AIAnalysisCard({ ai }) {
  if (!ai) return null;

  const scoreColor =
    ai.priorityScore >= 75
      ? "#F87171"
      : ai.priorityScore >= 55
      ? "#FB923C"
      : ai.priorityScore >= 35
      ? "#FBBF24"
      : "#34D399";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-base relative overflow-hidden p-5 sm:p-6"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-indigo/15 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <span className="section-eyebrow">Civi-X Analysis</span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
          {ai.source === "llm" ? "LLM engine" : "Rule-based engine"} · {ai.confidence}% confidence
        </span>
      </div>

      <div className="relative mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex flex-shrink-0 flex-col items-center">
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(${scoreColor} ${ai.priorityScore * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
            }}
          >
            <div className="flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-surface">
              <span className="text-2xl font-extrabold text-white">{ai.priorityScore}</span>
              <span className="text-[9px] font-medium uppercase tracking-wider text-white/35">/ 100</span>
            </div>
          </div>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Priority Score
          </p>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={ai.severity} />
            {ai.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/45"
              >
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-white/70">{ai.summary}</p>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-1 gap-3 border-t border-white/[0.06] pt-5 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-blue/15 text-accent-blue">
            <Building2 size={16} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/35">
              Assigned Department
            </p>
            <p className="mt-0.5 text-sm font-medium text-white">{ai.department}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-violet/15 text-accent-violet">
            <Wrench size={16} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/35">
              Recommended Action
            </p>
            <p className="mt-0.5 text-sm font-medium text-white">{ai.recommendedAction}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
