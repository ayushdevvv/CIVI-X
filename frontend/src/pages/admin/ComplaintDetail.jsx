import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, User, Calendar, Boxes, CheckCircle2 } from "lucide-react";
import { complaintsApi } from "../../api/client";
import { PageLoader } from "../../components/Loader";
import { ErrorState } from "../../components/StateViews";
import { CategoryPill, SeverityBadge } from "../../components/Badges";
import AIAnalysisCard from "../../components/AIAnalysisCard";
import StatusTimeline from "../../components/StatusTimeline";
import IssueMap from "../../components/IssueMap";
import { formatDate } from "../../utils/helpers";

const DEPARTMENTS = [
  "Roads & Infrastructure Dept.",
  "Electrical & Street Lighting Dept.",
  "Sanitation & Waste Management Dept.",
  "Water Supply Board",
  "Storm Water & Drainage Dept.",
  "Urban Planning & Enforcement",
  "Municipal Enforcement Cell",
  "General Administration",
];

const STATUSES = ["Reported", "Verified", "Assigned", "In Progress", "Resolved"];

export default function ComplaintDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintsApi.get(id);
      setData(res);
      setDepartment(res.complaint.assignedDepartment || res.complaint.ai?.department || DEPARTMENTS[7]);
      setStatus(res.complaint.status);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  if (loading) return <PageLoader label="Loading complaint..." />;
  if (error) return <ErrorState onRetry={load} title="Complaint not found" description={error} />;
  if (!data) return null;

  const { complaint, similar, cluster } = data;
  const score = complaint.ai?.priorityScore || 0;
  const reasons = score >= 90
    ? ["High public safety impact", "Multiple similar reports", "High complaint density", "Recurring location pattern"]
    : score >= 70
    ? ["Visible public impact", "Nearby related complaints", "Department workload signal"]
    : ["Low immediate risk", "Limited related reports", "Routine maintenance"];

  async function saveAssignment() {
    setSaving(true);
    setError(null);
    try {
      const result = await complaintsApi.assign(
        complaint.complaintId,
        department,
        status,
        `Assigned to ${department}.`
      );
      setData((current) => ({ ...current, complaint: result.complaint }));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <Link to="/admin/complaints" className="flex w-fit items-center gap-1.5 text-xs font-medium text-white/45 hover:text-white">
        <ArrowLeft size={14} /> Back to issues
      </Link>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-xs font-semibold text-accent-indigo/80">{complaint.complaintId}</p>
                <h1 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">{complaint.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <CategoryPill category={complaint.category} />
                  <SeverityBadge severity={complaint.ai?.severity} />
                </div>
              </div>
              <span className="status-pill">{complaint.status}</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/60">{complaint.description}</p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4 text-xs text-white/40">
              <span className="flex items-center gap-1.5"><MapPin size={13} /> {complaint.location?.address}</span>
              <span className="flex items-center gap-1.5"><User size={13} /> {complaint.reporterName}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} /> Reported {formatDate(complaint.createdAt)}</span>
            </div>

            {complaint.imageUrl && (
              <img src={complaint.imageUrl} alt="Reported issue" className="mt-4 max-h-72 w-full rounded-xl border border-white/10 object-cover" />
            )}
          </motion.div>

          <AIAnalysisCard ai={complaint.ai} />

          <div className="card-base p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Resolution timeline</p>
            <div className="mt-4">
              <StatusTimeline currentStatus={complaint.status} timeline={complaint.timeline} />
            </div>
          </div>

          {cluster && (
            <div className="card-base border-severity-high/20 bg-severity-high/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Boxes size={16} className="text-severity-high" />
                <p className="text-xs font-semibold uppercase tracking-wider text-severity-high">Recurring issue pattern</p>
              </div>
              <p className="mt-2 text-sm font-bold text-white">{cluster.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">{cluster.narrative}</p>
              <Link to="/admin/clusters" className="mt-3 inline-block text-xs font-semibold text-accent-indigo hover:underline">
                View full cluster
              </Link>
            </div>
          )}

          {similar?.length > 0 && (
            <div className="card-base p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Related nearby reports</p>
              <div className="mt-3 space-y-2">
                {similar.map((s) => (
                  <Link key={s.complaintId} to={`/admin/complaints/${s.complaintId}`} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:bg-white/[0.05]">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white/80">{s.title}</p>
                      <p className="font-mono text-[11px] text-white/30">{s.complaintId}</p>
                    </div>
                    <span className="flex-shrink-0 text-xs text-white/35">{s.distanceKm} km</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-5 xl:sticky xl:top-5 xl:self-start">
          <div className="card-base p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-white/35">Priority score</p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight text-white">{score}<span className="text-sm text-white/25">/100</span></p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase text-white/60">{complaint.ai?.severity}</span>
            </div>
            <div className="priority-meter"><div style={{ width: `${score}%` }} /></div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[.14em] text-white/35">Why this score</p>
            <div className="mt-2 space-y-2">
              {reasons.map((reason, i) => (
                <div key={reason} className="flex items-center gap-2">
                  <span className="w-7 text-[10px] font-bold text-accent-indigo">+{[28, 21, 18, 15][i] || 10}</span>
                  <span className="text-xs text-white/55">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-base p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-white/35">Field assignment</p>

            <label className="mt-4 block text-[10px] font-semibold uppercase text-white/35">Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input-base mt-2 w-full">
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>

            <label className="mt-4 block text-[10px] font-semibold uppercase text-white/35">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-base mt-2 w-full">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>

            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/35">Response target</span>
                <span className="text-xs font-bold text-white">2h</span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full bg-accent-indigo" style={{ width: `${complaint.slaProgress || 0}%` }} />
              </div>
              <p className="mt-2 text-[10px] text-white/35">
                {complaint.status === "Resolved"
                  ? "Target completed"
                  : `${Math.max(0, 120 - Math.round((complaint.slaProgress || 0) * 1.2))} min target remaining`}
              </p>
            </div>

            <button onClick={saveAssignment} disabled={saving} className="btn-primary mt-4 w-full">
              {saving ? "Saving assignment..." : saved ? "Assignment saved" : "Assign and update issue"}
            </button>

            {saved && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                <CheckCircle2 size={12} /> Department assignment updated
              </p>
            )}
          </div>

          <div className="card-base overflow-hidden p-0">
            <div className="p-5 pb-0"><p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">Location</p></div>
            <div className="p-5"><IssueMap complaints={[complaint]} center={complaint.location} height={240} /></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
