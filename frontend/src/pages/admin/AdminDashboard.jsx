import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  AlertTriangle,
  Clock,
  Activity,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { dashboardApi } from "../../api/client";
import StatCard from "../../components/StatCard";
import { PageLoader } from "../../components/Loader";
import { ErrorState } from "../../components/StateViews";
import { CHART_PALETTE, SEVERITY_COLORS } from "../../utils/constants";
import { PriorityScore, StatusBadge } from "../../components/Badges";
import { timeAgo } from "../../utils/helpers";

const chartTooltipStyle = {
  background: "#10152A",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  fontSize: 12,
  color: "#fff",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [statsData, queueData] = await Promise.all([dashboardApi.stats(), dashboardApi.queue()]);
      setStats(statsData);
      setQueue(queueData.items.slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <PageLoader label="Loading command center…" />;
  if (error) return <ErrorState onRetry={load} />;
  if (!stats) return null;

  const { totals, byCategory, bySeverity, trend } = stats;

  return (
    <div className="space-y-8">
      <div>
        <span className="section-eyebrow">Admin Command Center</span>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Civic Operations Overview
        </h1>
        <p className="mt-1.5 text-sm text-white/45">
          Real-time snapshot of every reported issue across the city.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-4">
        <div className="bg-[#0a0e15] px-4 py-3"><p className="text-[9px] uppercase tracking-[.14em] text-white/30">Field Operations</p><p className="mt-1 text-xs font-semibold text-white/80">All departments operational</p></div>
        <div className="bg-[#0a0e15] px-4 py-3"><p className="text-[9px] uppercase tracking-[.14em] text-white/30">At Risk</p><p className="mt-1 text-xs font-semibold text-white/80">{queue.filter((q) => q.ai?.priorityScore >= 80).length} active issues</p></div>
        <div className="bg-[#0a0e15] px-4 py-3"><p className="text-[9px] uppercase tracking-[.14em] text-white/30">Avg Response</p><p className="mt-1 text-xs font-semibold text-white/80">41 min</p></div>
        <div className="bg-[#0a0e15] px-4 py-3"><p className="text-[9px] uppercase tracking-[.14em] text-white/30">Resolution Rate</p><p className="mt-1 text-xs font-semibold text-white/80">86.4%</p></div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={ClipboardList} label="Total Issues" value={totals.total} tone="indigo" />
        <StatCard icon={AlertTriangle} label="Critical" value={totals.critical} tone="critical" delay={0.05} />
        <StatCard icon={Clock} label="Pending" value={totals.pending} tone="amber" delay={0.1} />
        <StatCard icon={Activity} label="In Progress" value={totals.inProgress} tone="blue" delay={0.15} />
        <StatCard icon={CheckCircle2} label="Resolved" value={totals.resolved} tone="green" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard title="Reports vs. Resolutions (14 days)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trend} margin={{ left: -20, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="reportedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34D399" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                stroke="rgba(255,255,255,0.3)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="reported" stroke="#6366F1" fill="url(#reportedGrad)" strokeWidth={2} name="Reported" />
              <Area type="monotone" dataKey="resolved" stroke="#34D399" fill="url(#resolvedGrad)" strokeWidth={2} name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Severity Breakdown">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={bySeverity}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                strokeWidth={0}
              >
                {bySeverity.map((entry) => (
                  <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] || "#8A93A8"} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-white/60">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard title="Issues by Category" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byCategory} margin={{ left: -20, right: 10, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.3)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {byCategory.map((entry, i) => (
                  <Cell key={entry.name} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top of Priority Queue" action={<Link to="/admin/queue" className="text-xs font-semibold text-accent-indigo hover:underline">View all</Link>}>
          <div className="space-y-2.5">
            {queue.map((c) => (
              <Link
                key={c.complaintId}
                to={`/admin/complaints/${c.complaintId}`}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.05]"
              >
                <PriorityScore score={c.ai?.priorityScore ?? 0} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white/85">{c.title}</p>
                  <p className="mt-0.5 text-[10px] text-white/35">{timeAgo(c.createdAt)}</p>
                </div>
                <StatusBadge status={c.status} className="hidden flex-shrink-0 sm:inline-flex" />
              </Link>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, action, children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`card-base p-5 ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-white">{title}</p>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}
