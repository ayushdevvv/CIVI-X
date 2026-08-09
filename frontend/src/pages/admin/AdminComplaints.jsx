import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { complaintsApi } from "../../api/client";
import { CATEGORIES, STATUSES, SEVERITIES } from "../../utils/constants";
import { PriorityScore, SeverityBadge, StatusBadge, CategoryPill } from "../../components/Badges";
import StatusUpdateControl from "../../components/StatusUpdateControl";
import { SkeletonGrid } from "../../components/Loader";
import { ErrorState, NoResultsState } from "../../components/StateViews";
import { timeAgo } from "../../utils/helpers";

export default function AdminComplaints() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [severity, setSeverity] = useState("All");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await complaintsApi.list({
        search: search || undefined,
        category,
        status,
        severity,
        sort: "-priority",
        limit: 60,
      });
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, status, severity]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  function handleUpdated(updated) {
    setItems((prev) => prev.map((c) => (c.complaintId === updated.complaintId ? updated : c)));
  }

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setStatus("All");
    setSeverity("All");
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="section-eyebrow">
          <Search size={13} /> All Complaints
        </span>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Manage every reported issue
        </h1>
        <p className="mt-1.5 text-sm text-white/45">
          {loading ? "Loading…" : `${total} complaint${total === 1 ? "" : "s"} in the system.`}
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            className="input-base pl-11"
            placeholder="Search complaints…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 lg:flex lg:flex-shrink-0">
          <select className="input-base py-2.5 text-xs" value={category} onChange={(e) => setCategory(e.target.value)}>
            {["All", ...CATEGORIES].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select className="input-base py-2.5 text-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
            {["All", ...STATUSES].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className="input-base py-2.5 text-xs" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            {["All", ...SEVERITIES].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <SkeletonGrid count={6} />}
      {!loading && error && <ErrorState onRetry={load} />}
      {!loading && !error && items.length === 0 && <NoResultsState onReset={resetFilters} />}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-3">
          {items.map((c, i) => (
            <motion.div
              key={c.complaintId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="card-base flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5"
            >
              <PriorityScore score={c.ai?.priorityScore ?? 0} />
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
              <div className="flex flex-shrink-0 items-center gap-2 sm:pl-2">
                <StatusUpdateControl complaint={c} onUpdated={handleUpdated} size="sm" />
                <Link to={`/admin/complaints/${c.complaintId}`} className="btn-ghost px-3 py-2 text-xs">
                  Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
