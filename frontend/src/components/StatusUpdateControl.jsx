import { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { STATUSES } from "../utils/constants";
import { complaintsApi } from "../api/client";

export default function StatusUpdateControl({ complaint, onUpdated, size = "md" }) {
  const [loading, setLoading] = useState(false);
  const currentIndex = STATUSES.indexOf(complaint.status);
  const nextStatus = STATUSES[currentIndex + 1];

  async function advance() {
    if (!nextStatus || loading) return;
    setLoading(true);
    try {
      const data = await complaintsApi.updateStatus(complaint.complaintId, nextStatus);
      onUpdated?.(data.complaint);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!nextStatus) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-severity-low/30 bg-severity-low/10 px-3 py-2 text-xs font-semibold text-severity-low">
        Resolved
      </span>
    );
  }

  return (
    <button
      onClick={advance}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-accent-indigo/30 bg-accent-indigo/10 font-semibold text-accent-indigo transition-colors hover:bg-accent-indigo/20 disabled:opacity-60 ${
        size === "sm" ? "px-2.5 py-1.5 text-[11px]" : "px-3.5 py-2 text-xs"
      }`}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <ChevronRight size={13} />}
      Move to {nextStatus}
    </button>
  );
}
