import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, LayoutGrid, Map as MapIcon, X } from "lucide-react";
import { complaintsApi } from "../api/client";
import { CATEGORIES, STATUSES, SEVERITIES } from "../utils/constants";
import ComplaintCard from "../components/ComplaintCard";
import IssueMap from "../components/IssueMap";
import { SkeletonGrid } from "../components/Loader";
import { ErrorState, NoResultsState } from "../components/StateViews";

const SORT_OPTIONS = [
  { label: "Newest first", value: "-createdAt" },
  { label: "Oldest first", value: "createdAt" },
  { label: "Highest priority", value: "-priority" },
  { label: "Lowest priority", value: "priority" },
];

export default function Explorer() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [sort, setSort] = useState("-createdAt");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await complaintsApi.list({
        search: search || undefined,
        category,
        status,
        severity,
        sort,
        limit: 60,
      });
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, status, severity, sort]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setStatus("All");
    setSeverity("All");
    setSort("-createdAt");
  }

  const hasActiveFilters = search || category !== "All" || status !== "All" || severity !== "All";

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="section-eyebrow">Issue Explorer</span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Browse reported issues
          </h1>
          <p className="mt-2 text-sm text-white/45">
            {loading ? "Loading…" : `${total} issue${total === 1 ? "" : "s"} found across the city.`}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              view === "grid" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            <LayoutGrid size={14} /> Grid
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              view === "map" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            <MapIcon size={14} /> Map
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mt-7 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              className="input-base pl-11"
              placeholder="Search by title, description, ID or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className={`btn-secondary flex-shrink-0 ${hasActiveFilters ? "border-accent-indigo/50 text-accent-indigo" : ""}`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-4"
          >
            <FilterSelect label="Category" value={category} onChange={setCategory} options={["All", ...CATEGORIES]} />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={["All", ...STATUSES]} />
            <FilterSelect label="Severity" value={severity} onChange={setSeverity} options={["All", ...SEVERITIES]} />
            <FilterSelect
              label="Sort by"
              value={sort}
              onChange={setSort}
              options={SORT_OPTIONS.map((o) => o.value)}
              renderLabel={(v) => SORT_OPTIONS.find((o) => o.value === v)?.label}
            />
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-medium text-white/50 hover:text-white sm:col-span-4"
              >
                <X size={13} /> Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </div>

      <div className="mt-8">
        {loading && <SkeletonGrid count={9} />}

        {!loading && error && <ErrorState onRetry={load} />}

        {!loading && !error && items.length === 0 && <NoResultsState onReset={resetFilters} />}

        {!loading && !error && items.length > 0 && view === "grid" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c, i) => (
              <ComplaintCard key={c.complaintId} complaint={c} index={i} />
            ))}
          </div>
        )}

        {!loading && !error && items.length > 0 && view === "map" && (
          <IssueMap complaints={items} height={560} />
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, renderLabel }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
        {label}
      </label>
      <select
        className="input-base py-2.5 text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {renderLabel ? renderLabel(opt) : opt}
          </option>
        ))}
      </select>
    </div>
  );
}
