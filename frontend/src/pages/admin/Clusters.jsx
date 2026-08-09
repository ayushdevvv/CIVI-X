import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes, MapPin, X, ChevronRight, Building2, Wrench } from "lucide-react";
import { clustersApi } from "../../api/client";
import { PageLoader } from "../../components/Loader";
import { ErrorState, EmptyState } from "../../components/StateViews";
import { SeverityBadge, StatusBadge } from "../../components/Badges";
import IssueMap from "../../components/IssueMap";
import { Link } from "react-router-dom";

const PRIORITY_STYLE = {
  High: "border-severity-high/30 bg-severity-high/10 text-severity-high",
  Medium: "border-severity-medium/30 bg-severity-medium/10 text-severity-medium",
  Low: "border-severity-low/30 bg-severity-low/10 text-severity-low",
};

export default function Clusters() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await clustersApi.list();
      setClusters(data.clusters);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="section-eyebrow">
          <Boxes size={13} /> Signature Feature
        </span>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          AI-Detected Recurring Issue Clusters
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-white/45">
          Civi-X automatically groups related complaints by category and proximity, surfacing
          patterns that would be invisible when triaging one complaint at a time.
        </p>
      </div>

      {loading && <PageLoader label="Detecting clusters…" />}
      {!loading && error && <ErrorState onRetry={load} />}
      {!loading && !error && clusters.length === 0 && (
        <EmptyState
          icon={Boxes}
          title="No recurring patterns yet"
          description="Clusters appear once 3 or more similar complaints are reported near each other."
        />
      )}

      {!loading && !error && clusters.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {clusters.map((c, i) => (
            <motion.button
              key={c.clusterId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.4) }}
              onClick={() => setActive(c)}
              className="card-base group flex flex-col p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent-indigo/30 hover:shadow-glow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-indigo/15 text-accent-indigo">
                  <Boxes size={18} />
                </span>
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${PRIORITY_STYLE[c.priority]}`}>
                  {c.priority} Priority
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-white group-hover:text-accent-indigo transition-colors">
                {c.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/45">{c.narrative}</p>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4 text-center">
                <div>
                  <p className="text-lg font-extrabold text-white">{c.reportCount}</p>
                  <p className="text-[10px] text-white/35">Reports</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-white">{c.locationCount}</p>
                  <p className="text-[10px] text-white/35">Locations</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-white">{c.avgPriorityScore}</p>
                  <p className="text-[10px] text-white/35">Avg. Score</p>
                </div>
              </div>

              <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-accent-indigo">
                View cluster <ChevronRight size={13} />
              </span>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {active && <ClusterDrawer cluster={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  );
}

function ClusterDrawer({ cluster, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative z-10 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-white/10 bg-surface p-6 sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.06] hover:text-white"
        >
          <X size={18} />
        </button>

        <span className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-semibold ${PRIORITY_STYLE[cluster.priority]}`}>
          {cluster.priority} Priority Cluster
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-white">{cluster.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{cluster.narrative}</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <MiniStat label="Reports" value={cluster.reportCount} />
          <MiniStat label="Locations" value={cluster.locationCount} />
          <MiniStat label="Avg. Priority" value={cluster.avgPriorityScore} />
        </div>

        <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-blue/15 text-accent-blue">
              <Building2 size={16} />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/35">Recommended Department</p>
              <p className="mt-0.5 text-sm font-medium text-white">{cluster.department}</p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-violet/15 text-accent-violet">
              <Wrench size={16} />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/35">Recommended Action</p>
              <p className="mt-0.5 text-sm font-medium text-white">{cluster.recommendedAction}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <IssueMap
            complaints={cluster.complaints.map((c) => ({ ...c, ai: { severity: c.severity } }))}
            center={cluster.centroid}
            height={240}
          />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-white/35">
          Linked Complaints ({cluster.complaints.length})
        </p>
        <div className="mt-3 space-y-2">
          {cluster.complaints.map((c) => (
            <Link
              key={c.complaintId}
              to={`/admin/complaints/${c.complaintId}`}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:bg-white/[0.05]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white/85">{c.title}</p>
                <p className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-white/30">
                  <MapPin size={10} /> {c.complaintId}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <SeverityBadge severity={c.severity} />
                <StatusBadge status={c.status} />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
      <p className="text-xl font-extrabold text-white">{value}</p>
      <p className="mt-0.5 text-[10px] text-white/35">{label}</p>
    </div>
  );
}
