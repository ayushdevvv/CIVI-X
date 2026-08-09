import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ListOrdered, MapPin } from "lucide-react";
import { dashboardApi } from "../../api/client";
import { PageLoader } from "../../components/Loader";
import { ErrorState, EmptyState } from "../../components/StateViews";
import { PriorityScore, SeverityBadge, StatusBadge, CategoryPill } from "../../components/Badges";
import StatusUpdateControl from "../../components/StatusUpdateControl";
import { timeAgo } from "../../utils/helpers";

export default function PriorityQueue() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.queue();
      setItems(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleUpdated(updated) {
    setItems((prev) =>
      updated.status === "Resolved"
        ? prev.filter((c) => c.complaintId !== updated.complaintId)
        : prev.map((c) => (c.complaintId === updated.complaintId ? updated : c))
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="section-eyebrow">
          <ListOrdered size={13} /> Priority Queue
        </span>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Highest-priority open issues
        </h1>
        <p className="mt-1.5 text-sm text-white/45">
          Ranked by Civi-X's AI priority score — resolve the most urgent issues first.
        </p>
      </div>

      {loading && <PageLoader label="Loading priority queue…" />}
      {!loading && error && <ErrorState onRetry={load} />}
      {!loading && !error && items.length === 0 && (
        <EmptyState icon={ListOrdered} title="Queue is empty" description="All issues are resolved. Great work!" />
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-3">
          {items.map((c, i) => (
            <motion.div
              key={c.complaintId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="card-base flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5"
            >
              <div className="flex items-center gap-4">
                <span className="w-6 flex-shrink-0 text-center text-xs font-bold text-white/25">{i + 1}</span>
                <PriorityScore score={c.ai?.priorityScore ?? 0} />
              </div>

              <div className="min-w-0 flex-1">
                <Link to={`/admin/complaints/${c.complaintId}`} className="block truncate text-sm font-bold text-white hover:text-accent-indigo">
                  {c.title}
                </Link>
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-white/35">
                  <MapPin size={11} /> {c.location?.address}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <CategoryPill category={c.category} />
                  <SeverityBadge severity={c.ai?.severity} />
                  <StatusBadge status={c.status} />
                  <span className="text-[10px] text-white/25">{timeAgo(c.createdAt)}</span>
                </div>
              </div>

              <div className="flex-shrink-0 sm:pl-2">
                <StatusUpdateControl complaint={c} onUpdated={handleUpdated} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
