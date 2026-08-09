import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { STATUSES } from "../utils/constants";
import { formatDateTime } from "../utils/helpers";

export default function StatusTimeline({ currentStatus, timeline = [], orientation = "horizontal" }) {
  const currentIndex = STATUSES.indexOf(currentStatus);

  const eventFor = (status) => timeline.find((t) => t.status === status);

  if (orientation === "vertical") {
    return (
      <div className="space-y-0">
        {STATUSES.map((status, i) => {
          const done = i <= currentIndex;
          const event = eventFor(status);
          return (
            <div key={status} className="relative flex gap-4 pb-8 last:pb-0">
              {i < STATUSES.length - 1 && (
                <span
                  className={`absolute left-[15px] top-8 h-full w-px ${
                    i < currentIndex ? "bg-accent-indigo" : "bg-white/10"
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                  done
                    ? "border-accent-indigo bg-accent-indigo/20 text-accent-indigo"
                    : "border-white/15 bg-surface text-white/30"
                }`}
              >
                {done ? <Check size={15} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              <div className="pt-0.5">
                <p className={`text-sm font-semibold ${done ? "text-white" : "text-white/40"}`}>
                  {status}
                </p>
                {event ? (
                  <>
                    <p className="mt-0.5 text-xs text-white/40">{formatDateTime(event.at)}</p>
                    {event.note && <p className="mt-1 text-xs text-white/50">{event.note}</p>}
                  </>
                ) : (
                  <p className="mt-0.5 text-xs text-white/25">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex min-w-[560px] items-center sm:min-w-0">
        {STATUSES.map((status, i) => {
          const done = i <= currentIndex;
          const event = eventFor(status);
          return (
            <div key={status} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <span
                  className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : i <= currentIndex ? "bg-accent-indigo" : "bg-white/10"}`}
                />
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    done
                      ? "border-accent-indigo bg-accent-indigo/20 text-accent-indigo shadow-glow-sm"
                      : "border-white/15 bg-surface text-white/30"
                  }`}
                >
                  {done ? <Check size={16} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                </motion.span>
                <span
                  className={`h-0.5 flex-1 ${i === STATUSES.length - 1 ? "opacity-0" : i < currentIndex ? "bg-accent-indigo" : "bg-white/10"}`}
                />
              </div>
              <p className={`mt-2 text-xs font-semibold ${done ? "text-white" : "text-white/35"}`}>
                {status}
              </p>
              {event && <p className="mt-0.5 text-[10px] text-white/30">{formatDateTime(event.at)}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
