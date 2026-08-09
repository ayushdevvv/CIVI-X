import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ImagePlus,
  MapPin,
  LocateFixed,
  Navigation,
  Copy,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { CATEGORIES, LUCKNOW_CENTER } from "../utils/constants";
import LocationPicker from "../components/LocationPicker";
import AIAnalysisCard from "../components/AIAnalysisCard";
import StatusTimeline from "../components/StatusTimeline";
import { Spinner } from "../components/Loader";
import { complaintsApi } from "../api/client";

const ANALYSIS_STEPS = [
  "Reading complaint text…",
  "Classifying category & severity…",
  "Calculating priority score…",
  "Matching similar nearby reports…",
  "Finalizing recommendation…",
];

export default function ReportIssue() {
  const [step, setStep] = useState("form"); // form | analyzing | result | error
  const [analysisStepIdx, setAnalysisStepIdx] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
    reporterName: "",
  });
  const [location, setLocation] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const query = form.address.trim();
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=4&countrycodes=in&q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setLocationSuggestions(Array.isArray(data) ? data : []);
      } catch {
        setLocationSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 420);
    return () => clearTimeout(timer);
  }, [form.address]);

  function chooseSuggestion(item) {
    update("address", item.display_name);
    setLocation({ lat: Number(item.lat), lng: Number(item.lon) });
    setLocationSuggestions([]);
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  }

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setErrors((er) => ({ ...er, image: "Image must be under 4MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocation({ ...LUCKNOW_CENTER });
      }
    );
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Please add a short title.";
    if (!form.description.trim() || form.description.trim().length < 15)
      e.description = "Please describe the issue in at least 15 characters.";
    if (!form.category) e.category = "Please select a category.";
    if (!form.address.trim()) e.address = "Please add an address or landmark.";
    if (!location) e.location = "Please enter a location or choose the exact spot on the map.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;

    setStep("analyzing");
    setAnalysisStepIdx(0);
    const stepTimer = setInterval(() => {
      setAnalysisStepIdx((i) => Math.min(i + 1, ANALYSIS_STEPS.length - 1));
    }, 550);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: { address: form.address.trim(), lat: location.lat, lng: location.lng },
        imageUrl: imagePreview,
        reporterName: form.reporterName.trim() || "Anonymous Citizen",
      };
      const [data] = await Promise.all([
        complaintsApi.create(payload),
        new Promise((r) => setTimeout(r, ANALYSIS_STEPS.length * 550 + 200)),
      ]);
      clearInterval(stepTimer);
      setResult(data);
      setStep("result");
    } catch (err) {
      clearInterval(stepTimer);
      setErrorMsg(err.message);
      setStep("error");
    }
  }

  function copyId() {
    if (!result?.complaint?.complaintId) return;
    navigator.clipboard?.writeText(result.complaint.complaintId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function resetForm() {
    setForm({ title: "", description: "", category: "", address: "", reporterName: "" });
    setLocation(null);
    setImagePreview(null);
    setResult(null);
    setStep("form");
  }

  return (
    <div className="report-page mx-auto max-w-5xl px-4 py-8 sm:px-7 sm:py-12">
      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="report-kicker"><span className="section-eyebrow">Citizen report</span><span className="report-secure">Private by default</span></div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Report it. We'll route it.
            </h1>
            <p className="mt-2 text-sm text-white/45">
              Add the essentials once. Civi-X will score the issue, find related reports and recommend the right department.
            </p>

            <div className="report-intro-card"><div><span>01</span><b>Describe the issue</b><small>What happened and where?</small></div><div><span>02</span><b>Pin the location</b><small>Help the right team find it.</small></div><div><span>03</span><b>Get a tracked ID</b><small>Follow progress after submission.</small></div></div>

            <div className="report-trust"><div><b>Fast triage</b><span>Usually analyzed in seconds</span></div><div><b>Location aware</b><span>Routes issues to the right team</span></div><div><b>Trackable</b><span>Every report gets a unique ID</span></div></div>

            <form onSubmit={handleSubmit} className="card-base report-form mt-4 space-y-5 p-4 sm:p-6">
              <div>
                <label className="label-base">Issue title</label>
                <input
                  className="input-base"
                  placeholder="e.g. Large pothole near Charbagh crossing"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  maxLength={100}
                />
                {errors.title && <FieldError msg={errors.title} />}
              </div>

              <div>
                <label className="label-base">Description</label>
                <textarea
                  className="input-base min-h-[110px] resize-y"
                  placeholder="Describe what you observed, how long it's been an issue, and any safety concerns…"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  maxLength={800}
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.description ? <FieldError msg={errors.description} /> : <span />}
                  <span className="text-[11px] text-white/25">{form.description.length}/800</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="label-base">Category</label>
                  <select
                    className="input-base"
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.category && <FieldError msg={errors.category} />}
                </div>
                <div>
                  <label className="label-base">Your name (optional)</label>
                  <input
                    className="input-base"
                    placeholder="Anonymous Citizen"
                    value={form.reporterName}
                    onChange={(e) => update("reporterName", e.target.value)}
                  />
                </div>
              </div>

              <div className="location-section">
                <div className="mb-2 flex items-end justify-between gap-3">
                  <div>
                    <label className="label-base mb-1">Where is the issue?</label>
                    <p className="text-[11px] text-white/30">Start typing a street, landmark or area.</p>
                  </div>
                  {location && <span className="location-confirmed">Location selected</span>}
                </div>

                <div className="relative">
                  <MapPin size={15} className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-white/30" />
                  <input
                    className="input-base pl-10"
                    placeholder="Try “Hazratganj Metro Station” or “Aliganj Sector 3”"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    autoComplete="off"
                  />
                  {suggestionsLoading && <span className="location-loading">Searching</span>}
                  {locationSuggestions.length > 0 && (
                    <div className="location-suggestions">
                      {locationSuggestions.map((item) => (
                        <button type="button" key={item.place_id} onClick={() => chooseSuggestion(item)} className="location-suggestion">
                          <MapPin size={14} />
                          <span>{item.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.address && <FieldError msg={errors.address} />}

                <div className="map-choice-card">
                  <div className="map-choice-copy">
                    <span className="map-choice-icon"><Navigation size={16} /></span>
                    <div>
                      <b>Choose precisely on the map</b>
                      <span>Use this if the exact spot is easier to point out than describe.</span>
                    </div>
                  </div>
                  <button type="button" className="map-choice-button" onClick={() => setMapOpen(true)}>
                    Open map
                  </button>
                </div>

                {location && (
                  <div className="selected-location-line">
                    <span>Selected coordinates</span>
                    <b>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</b>
                    <button type="button" onClick={() => setMapOpen(true)}>Change</button>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {mapOpen && (
                  <motion.div className="map-modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setMapOpen(false)}>
                    <motion.div className="map-modal" initial={{opacity:0,y:18,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:18,scale:.98}} onClick={(e)=>e.stopPropagation()}>
                      <div className="map-modal-head">
                        <div><span className="section-eyebrow">Pin location</span><h3>Select the exact spot</h3><p>Click anywhere on the map to place your report.</p></div>
                        <button type="button" className="map-close" onClick={() => setMapOpen(false)}><X size={17}/></button>
                      </div>
                      <LocationPicker value={location} onChange={setLocation} />
                      <div className="map-modal-foot">
                        <button type="button" className="btn-secondary" onClick={useMyLocation}><LocateFixed size={14}/> Use my location</button>
                        <button type="button" className="btn-primary" onClick={() => setMapOpen(false)}>Use this location</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form-section-divider"><span>Optional evidence</span></div>
              <div>
                <label className="label-base">Photo (optional)</label>
                {imagePreview ? (
                  <div className="relative w-fit">
                    <img
                      src={imagePreview}
                      alt="Issue preview"
                      className="h-32 w-48 rounded-xl border border-white/10 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-base border border-white/10 text-white/60 hover:text-white"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 text-white/35 transition-colors hover:border-accent-indigo/40 hover:text-white/60"
                  >
                    <ImagePlus size={20} />
                    <span className="text-xs">Click to upload a photo</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                {errors.image && <FieldError msg={errors.image} />}
              </div>

              <button type="submit" className="btn-primary report-submit w-full py-3.5 text-base">
                Analyze &amp; Submit
              </button>
            </form>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[60vh] flex-col items-center justify-center text-center"
          >
            <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
              <span className="absolute inset-0 animate-pulse-glow rounded-full bg-accent-indigo/20 blur-2xl" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-accent-indigo/30 bg-surface">
                <span className="text-[10px] font-bold uppercase tracking-[.14em] text-accent-indigo">Civi-X Analysis</span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">Civi-X is analyzing your report</h2>
            <div className="mt-6 space-y-2.5">
              {ANALYSIS_STEPS.map((s, i) => (
                <motion.p
                  key={s}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: i <= analysisStepIdx ? 1 : 0.2 }}
                  className="flex items-center justify-center gap-2 text-sm"
                >
                  {i < analysisStepIdx ? (
                    <Check size={14} className="text-severity-low" />
                  ) : i === analysisStepIdx ? (
                    <Spinner size={14} />
                  ) : (
                    <span className="h-3.5 w-3.5 rounded-full border border-white/15" />
                  )}
                  <span className={i <= analysisStepIdx ? "text-white/80" : "text-white/30"}>{s}</span>
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-severity-critical/10">
              <AlertCircle size={24} className="text-severity-critical" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-white">Couldn't submit your report</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-white/45">{errorMsg}</p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-white/30">
              Make sure the backend API is running (see README) and try again.
            </p>
            <button onClick={() => setStep("form")} className="btn-secondary mt-6">
              Back to form
            </button>
          </motion.div>
        )}

        {step === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-severity-low/10">
                <Check size={26} className="text-severity-low" />
              </div>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Report submitted successfully</h1>
              <p className="mt-2 text-sm text-white/45">
                Civi-X has analyzed your complaint and assigned it a unique tracking ID.
              </p>
            </div>

            <div className="card-base flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Complaint ID</p>
                <p className="mt-1 font-mono text-2xl font-extrabold text-accent-indigo">
                  {result.complaint.complaintId}
                </p>
              </div>
              <button onClick={copyId} className="btn-secondary">
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy ID"}
              </button>
            </div>

            <AIAnalysisCard ai={result.complaint.ai} />

            <div className="card-base p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Status Timeline</p>
              <div className="mt-4">
                <StatusTimeline currentStatus={result.complaint.status} timeline={result.complaint.timeline} />
              </div>
            </div>

            {result.similar?.length > 0 && (
              <div className="card-base p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                  Similar nearby reports found
                </p>
                <div className="mt-3 space-y-2">
                  {result.similar.map((s) => (
                    <div
                      key={s.complaintId}
                      className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white/80">{s.title}</p>
                        <p className="font-mono text-[11px] text-white/30">{s.complaintId}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs text-white/35">{s.distanceKm} km away</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-white/35">
                  This may be part of a recurring cluster — visible in the admin command center.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={`/track/${result.complaint.complaintId}`} className="btn-primary flex-1 py-3.5">
                Track this complaint
              </Link>
              <button onClick={resetForm} className="btn-secondary flex-1 py-3.5">
                Report another issue
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FieldError({ msg }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-severity-critical">
      <AlertCircle size={12} /> {msg}
    </p>
  );
}
