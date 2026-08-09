import { motion } from "framer-motion";
import { useCountUp } from "../hooks/useCountUp";
import { classNames } from "../utils/helpers";

export default function StatCard({ icon: Icon, label, value, tone = "indigo", suffix = "", delay = 0 }) {
  const count = useCountUp(value);

  const toneMap = {
    indigo: "from-accent-indigo/20 to-accent-indigo/0 text-accent-indigo",
    critical: "from-severity-critical/20 to-severity-critical/0 text-severity-critical",
    amber: "from-severity-medium/20 to-severity-medium/0 text-severity-medium",
    green: "from-severity-low/20 to-severity-low/0 text-severity-low",
    blue: "from-accent-blue/20 to-accent-blue/0 text-accent-blue",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card-base group relative overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div
        className={classNames(
          "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-90",
          toneMap[tone]
        )}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-white">
            {count.toLocaleString("en-IN")}
            {suffix}
          </p>
        </div>
        {Icon && (
          <div className={classNames("flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]", toneMap[tone].split(" ").pop())}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
