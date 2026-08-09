import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SeverityBadge, StatusBadge, PriorityScore, CategoryPill } from "./Badges";
import { timeAgo, truncate } from "../utils/helpers";

export default function ComplaintCard({ complaint, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
    >
      <Link
        to={`/track/${complaint.complaintId}`}
        className="card-base group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-semibold text-accent-indigo/80">
              {complaint.complaintId}
            </p>
            <h3 className="mt-1 truncate text-sm font-bold text-white group-hover:text-accent-indigo transition-colors">
              {complaint.title}
            </h3>
          </div>
          <PriorityScore score={complaint.ai?.priorityScore ?? 0} size="sm" />
        </div>

        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-white/45">
          {truncate(complaint.description, 120)}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <CategoryPill category={complaint.category} />
          <SeverityBadge severity={complaint.ai?.severity} />
          <StatusBadge status={complaint.status} />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-white/35">
          <span className="flex min-w-0 items-center gap-1">
            <MapPin size={12} className="flex-shrink-0" />
            <span className="truncate">{complaint.location?.address}</span>
          </span>
          <span className="flex-shrink-0 pl-2">{timeAgo(complaint.createdAt)}</span>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-accent-indigo/0 group-hover:text-accent-indigo/90 transition-colors">
          View details <ArrowUpRight size={13} />
        </div>
      </Link>
    </motion.div>
  );
}
