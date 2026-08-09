import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, Boxes, ArrowRight } from "lucide-react";
import { insightsApi } from "../../api/client";
import { PageLoader } from "../../components/Loader";
import { ErrorState } from "../../components/StateViews";

const PRIORITY_STYLES = {
  High: "border-severity-high/30 bg-severity-high/10 text-severity-high",
  Medium: "border-severity-medium/30 bg-severity-medium/10 text-severity-medium",
  Low: "border-severity-low/30 bg-severity-low/10 text-severity-low",
};

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await insightsApi.get();
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <PageLoader label="Generating AI insights…" />;
  if (error) return <ErrorState onRetry={load} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <span className="section-eyebrow">Civic Insights</span>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          What Civi-X is seeing right now
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-white/45">
          An automatically generated narrative summary of citywide complaint patterns.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base relative overflow-hidden p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-indigo/15 blur-[80px]" />
        <div className="relative flex items-start gap-4">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-blue shadow-glow-sm text-xs font-bold text-white">
            CX
          </span>
          <div>
            <p className="text-lg font-bold leading-snug text-white sm:text-xl">{data.headline}</p>
          </div>
        </div>

        <div className="relative mt-6 space-y-3">
          {data.points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <TrendingUp size={16} className="mt-0.5 flex-shrink-0 text-accent-indigo" />
              <p className="text-sm leading-relaxed text-white/70">{point}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div>
        <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-white">
          <Boxes size={15} className="text-accent-indigo" /> Top recurring clusters
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {data.clusterHighlights.map((c, i) => (
            <motion.div
              key={c.clusterId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-base p-5"
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${PRIORITY_STYLES[c.priority]}`}>
                  {c.priority}
                </span>
                <span className="text-xs font-bold text-white/50">{c.reportCount} reports</span>
              </div>
              <p className="mt-3 text-sm font-bold text-white">{c.title}</p>
              <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-white/45">{c.narrative}</p>
              <Link
                to="/admin/clusters"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-indigo hover:underline"
              >
                View cluster <ArrowRight size={12} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
