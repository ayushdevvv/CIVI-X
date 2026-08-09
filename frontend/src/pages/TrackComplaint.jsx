import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, User, Calendar, Boxes, AlertCircle } from "lucide-react";
import { complaintsApi } from "../api/client";
import { PageLoader } from "../components/Loader";
import { ErrorState, EmptyState } from "../components/StateViews";
import AIAnalysisCard from "../components/AIAnalysisCard";
import StatusTimeline from "../components/StatusTimeline";
import { CategoryPill } from "../components/Badges";
import { formatDate } from "../utils/helpers";
import IssueMap from "../components/IssueMap";

export default function TrackComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(id || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [lookupMode, setLookupMode] = useState("id");
  const [locationValue, setLocationValue] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationSearched, setLocationSearched] = useState(false);

  useEffect(() => {
    if (id) fetchComplaint(id);
  }, [id]);

  async function fetchComplaint(complaintId) {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const result = await complaintsApi.get(complaintId.trim().toUpperCase());
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!searchValue.trim()) return;
    navigate(`/track/${searchValue.trim().toUpperCase()}`);
  }

  async function handleLocationSearch(e) {
    e.preventDefault();
    if (locationValue.trim().length < 3) return;
    setLocationLoading(true);
    setLocationSearched(true);
    setError(null);
    setLocationResults([]);
    try {
      const result = await complaintsApi.searchByLocation(locationValue.trim());
      setLocationResults(result.items || []);
      setData(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLocationLoading(false);
    }
  }

  function openLocationComplaint(complaintId) {
    navigate(`/track/${complaintId}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <span className="section-eyebrow">Complaint Tracking</span>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Find your complaint
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/45">
        Use your complaint ID for the fastest lookup, or search by the location you reported if you no longer have the ID.
      </p>

      <div className="mt-7 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090e15]">
        <div className="grid grid-cols-2 border-b border-white/[0.07]">
          <button type="button" onClick={() => {setLookupMode("id");setError(null)}} className={`tracking-tab ${lookupMode==="id"?"active":""}`}>
            <Search size={14}/> Complaint ID
          </button>
          <button type="button" onClick={() => {setLookupMode("location");setError(null)}} className={`tracking-tab ${lookupMode==="location"?"active":""}`}>
            <MapPin size={14}/> Search by location
          </button>
        </div>

        <AnimatePresence mode="wait">
          {lookupMode === "id" ? (
            <motion.form key="id" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} onSubmit={handleSearch} className="flex flex-col gap-3 p-4 sm:flex-row">
              <div className="relative flex-1">
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input className="input-base pl-11 font-mono uppercase tracking-wide" placeholder="CVX-XXXXX" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary sm:px-8">Track complaint</button>
            </motion.form>
          ) : (
            <motion.form key="location" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} onSubmit={handleLocationSearch} className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input className="input-base pl-11" placeholder="Enter the area, street or landmark you reported" value={locationValue} onChange={(e)=>setLocationValue(e.target.value)} />
                </div>
                <button type="submit" className="btn-primary sm:px-8">Find reports</button>
              </div>
              <p className="mt-2 px-1 text-[9px] leading-relaxed text-white/30">
                We will show matching reports from that location. Select yours to open the full timeline.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {lookupMode === "location" && locationSearched && !locationLoading && (
        <div className="mt-5">
          {locationResults.length > 0 ? (
            <div className="card-base overflow-hidden">
              <div className="border-b border-white/[0.06] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Matching reports</p>
                <p className="mt-1 text-[10px] text-white/30">{locationResults.length} result{locationResults.length===1?"":"s"} found near that location.</p>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {locationResults.map((item) => (
                  <button key={item.complaintId} type="button" onClick={()=>openLocationComplaint(item.complaintId)} className="location-result-row">
                    <div className="location-result-score">{item.ai?.priorityScore ?? 0}</div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-xs font-bold text-white/85">{item.title}</p>
                      <p className="mt-1 truncate text-[9px] text-white/35">{item.location?.address}</p>
                    </div>
                    <div className="text-right">
                      <span className={`location-result-severity ${String(item.ai?.severity||"").toLowerCase()}`}>{item.ai?.severity}</span>
                      <p className="mt-1 text-[8px] text-white/30">{item.status}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="card-base p-5">
              <p className="text-sm font-semibold text-white/75">No reports found for that location.</p>
              <p className="mt-1 text-xs leading-relaxed text-white/35">Try a shorter landmark, street name or nearby area.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-10">
        {loading && <PageLoader label="Fetching complaint details…" />}

        {!loading && error && lookupMode === "id" && (
          <ErrorState
            title="Complaint not found"
            description={`We couldn't find a complaint matching "${id}". Double-check the ID and try again.`}
            onRetry={() => fetchComplaint(id)}
          />
        )}

        {!loading && !searched && lookupMode === "id" && (
          <EmptyState
            icon={Search}
            title="No complaint looked up yet"
            description="Enter a complaint ID above to see its live status and AI analysis."
          />
        )}

        {!loading && data && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="card-base p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-semibold text-accent-indigo/80">
                    {data.complaint.complaintId}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-white">{data.complaint.title}</h2>
                </div>
                <CategoryPill category={data.complaint.category} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{data.complaint.description}</p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4 text-xs text-white/40">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> {data.complaint.location?.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={13} /> {data.complaint.reporterName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} /> Reported {formatDate(data.complaint.createdAt)}
                </span>
              </div>

              {data.complaint.imageUrl && (
                <img
                  src={data.complaint.imageUrl}
                  alt="Reported issue"
                  className="mt-4 max-h-64 w-full rounded-xl border border-white/10 object-cover"
                />
              )}
            </div>

            <div className="card-base p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Status Timeline</p>
              <div className="mt-4">
                <StatusTimeline currentStatus={data.complaint.status} timeline={data.complaint.timeline} />
              </div>
            </div>

            <AIAnalysisCard ai={data.complaint.ai} />

            {data.cluster && (
              <div className="card-base border-severity-high/20 bg-severity-high/[0.03] p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <Boxes size={16} className="text-severity-high" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-severity-high">
                    Part of a recurring cluster
                  </p>
                </div>
                <p className="mt-2 text-sm font-bold text-white">{data.cluster.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{data.cluster.narrative}</p>
                <p className="mt-2 text-xs text-white/40">
                  {data.cluster.reportCount} linked reports across {data.cluster.locationCount} nearby locations.
                </p>
              </div>
            )}

            <div className="card-base overflow-hidden p-0">
              <div className="p-5 pb-0 sm:p-6 sm:pb-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Reported Location</p>
              </div>
              <div className="p-5 sm:p-6">
                <IssueMap complaints={[data.complaint]} center={data.complaint.location} height={280} />
              </div>
            </div>

            {data.similar?.length > 0 && (
              <div className="card-base p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                  Similar nearby reports
                </p>
                <div className="mt-3 space-y-2">
                  {data.similar.map((s) => (
                    <button
                      key={s.complaintId}
                      onClick={() => navigate(`/track/${s.complaintId}`)}
                      className="flex w-full items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white/80">{s.title}</p>
                        <p className="font-mono text-[11px] text-white/30">{s.complaintId}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs text-white/35">{s.distanceKm} km</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
