import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import IssueMap from "../components/IssueMap";
import {
  ArrowRight,
  MapPin,
  Users,
  BarChart3,
  Zap,
  ScanSearch,
  Boxes,
  ClipboardCheck,
  Radar,
  Lightbulb,
  Trash2,
  Droplets,
  Waves,
  Construction,
  Building2,
  MegaphoneOff,
  CircleDot,
  Headset,
} from "lucide-react";
import StatCard from "../components/StatCard";

const FLOW_STEPS = [
  {
    title: "Report Issue",
    desc: "Citizen submits a complaint with title, category, location and an optional photo.",
    icon: ClipboardCheck,
  },
  {
    title: "AI Analysis",
    desc: "Civi-X reads the report, classifies severity and drafts a triage summary in seconds.",
    icon: ScanSearch,
  },
  {
    title: "Priority Score",
    desc: "Every issue gets a 0–100 urgency score so the most critical problems surface first.",
    icon: Radar,
  },
  {
    title: "Similar Issues",
    desc: "Related complaints nearby are automatically linked and grouped into clusters.",
    icon: ScanSearch,
  },
  {
    title: "Admin Action",
    desc: "The command center routes each issue to the right department with a recommended action.",
    icon: Boxes,
  },
  {
    title: "Resolution Tracking",
    desc: "Citizens follow their complaint through a live status timeline until it's resolved.",
    icon: BarChart3,
  },
];

const CATEGORIES = [
  { name: "Potholes", icon: CircleDot },
  { name: "Streetlights", icon: Lightbulb },
  { name: "Garbage", icon: Trash2 },
  { name: "Water Leakage", icon: Droplets },
  { name: "Drainage", icon: Waves },
  { name: "Damaged Roads", icon: Construction },
  { name: "Illegal Construction", icon: Building2 },
  { name: "Public Nuisance", icon: MegaphoneOff },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-radial">
        <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent-indigo/10 blur-[120px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:pt-28">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mx-auto flex max-w-3xl flex-col items-center text-center"
          >
            <span className="section-eyebrow">AI-Powered Civic Intelligence</span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
              Civic problems, solved with{" "}
              <span className="bg-gradient-to-r from-accent-indigo via-accent-blue to-accent-cyan bg-clip-text text-transparent">
                machine intelligence.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
              Civi-X turns scattered pothole, streetlight and drainage complaints into a
              prioritized, department-routed action plan — automatically detecting recurring
              issue clusters before they become citywide problems.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Link to="/report" className="btn-primary landing-cta landing-action-primary w-full px-7 py-3.5 text-base sm:w-auto">
                <ClipboardCheck size={17} />
                Report an Issue
                <ArrowRight size={15} />
              </Link>
              <Link to="/track" className="btn-secondary landing-cta-secondary landing-action-secondary w-full px-7 py-3.5 text-base sm:w-auto">
                <MapPin size={16} />
                Track Complaint
              </Link>
              <Link to="/helpline" className="landing-action-quiet w-full sm:w-auto">
                <Headset size={15} />
                Talk to Helpline
              </Link>
            </div>

            <div className="landing-signal-row mt-8">
              <div><span className="signal-dot live"></span><b>2,481</b><small>reports analyzed</small></div>
              <div><b>37</b><small>recurring clusters</small></div>
              <div><b>86.4%</b><small>resolution rate</small></div>
            </div>

          </motion.div>

          {/* Hero visual — floating priority card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-16 max-w-3xl"
          >
            <div className="glass-panel animate-float p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-severity-high/15 text-severity-high">
                    <Lightbulb size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">Streetlight Failure Cluster</p>
                    <p className="text-xs text-white/40">Hazratganj Corridor, Lucknow</p>
                  </div>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-severity-high/30 bg-severity-high/10 px-3 py-1 text-xs font-semibold text-severity-high">
                  High Priority
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-4 text-center sm:text-left">
                <div>
                  <p className="text-lg font-extrabold text-white">23</p>
                  <p className="text-[11px] text-white/40">Reports</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-white">4</p>
                  <p className="text-[11px] text-white/40">Locations</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-white">87</p>
                  <p className="text-[11px] text-white/40">Avg. Priority</p>
                </div>
              </div>
              <p className="mt-4 rounded-xl bg-white/[0.03] p-3 text-xs leading-relaxed text-white/45">
                Multiple complaints describe a recurring lighting problem across the same
                corridor — recommending a consolidated repair crew dispatch.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={ClipboardCheck} label="Issues Reported" value={2481} tone="indigo" delay={0} />
          <StatCard icon={ClipboardCheck} label="Analyses Run" value={2481} tone="blue" delay={0.05} />
          <StatCard icon={Boxes} label="Clusters Detected" value={37} tone="amber" delay={0.1} />
          <StatCard icon={BarChart3} label="Issues Resolved" value={1926} tone="green" delay={0.15} />
        </div>
      </section>

      {/* PRODUCT EXPLANATION / FLOW */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="section-eyebrow">How it works</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            From a citizen's report to a resolved issue
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/45 sm:text-base">
            One continuous pipeline — every report is analyzed, scored, linked and routed
            without manual triage.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FLOW_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              className="card-base group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-indigo/30"
            >
              <div className="pointer-events-none absolute inset-0 bg-card-sheen opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-indigo/15 text-accent-indigo">
                    <step.icon size={18} />
                  </span>
                  <span className="text-xs font-bold text-white/25">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/45">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-y border-white/[0.06] bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="section-eyebrow">Coverage</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Every everyday civic issue, covered
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="card-base flex flex-col items-center gap-3 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent-indigo/30"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-indigo/10 text-accent-indigo">
                  <cat.icon size={20} />
                </span>
                <p className="text-sm font-semibold text-white">{cat.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNATURE FEATURE */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <span className="section-eyebrow">Signature Feature</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Recurring issue clusters, detected automatically
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/50 sm:text-base">
              Civi-X doesn't just triage individual complaints — it looks across the whole city
              to find patterns. When multiple reports describe the same problem in the same
              area, they're grouped into a cluster with a recommended, consolidated action for
              admins.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/60">
              {[
                "Groups related complaints by category and proximity",
                "Surfaces a priority level for the whole recurring pattern",
                "Recommends one consolidated work order instead of dozens",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-indigo" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/admin/clusters" className="btn-secondary mt-7">
              See clusters in the admin console
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="glass-panel p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Live Cluster Preview
              </p>
              <span className="flex h-2 w-2 animate-pulse-glow rounded-full bg-severity-high" />
            </div>

            {[
              { title: "Streetlight Failure Cluster", area: "Hazratganj Corridor", reports: 23, priority: "High", color: "high" },
              { title: "Pothole Cluster", area: "Kanpur Road Stretch", reports: 14, priority: "Medium", color: "medium" },
              { title: "Drainage Blockage Cluster", area: "Aliganj Sector 3", reports: 9, priority: "High", color: "high" },
            ].map((c) => (
              <div
                key={c.title}
                className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">{c.title}</p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      c.color === "high"
                        ? "border-severity-high/30 bg-severity-high/10 text-severity-high"
                        : "border-severity-medium/30 bg-severity-medium/10 text-severity-medium"
                    }`}
                  >
                    {c.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/40">{c.area}</p>
                <p className="mt-2 text-xs font-medium text-white/55">{c.reports} linked reports</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CITY VIEW + PRIORITY SIGNALS */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_.6fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="card-base overflow-hidden p-0"
          >
            <div className="flex flex-col gap-3 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="section-eyebrow">City View</span>
                <h3 className="mt-3 text-lg font-bold text-white">See where issues are building</h3>
                <p className="mt-1 text-xs text-white/40">High-priority reports surface first so recurring problems are easier to spot.</p>
              </div>
              <Link to="/explorer" className="btn-secondary landing-map-btn w-fit px-4 py-2.5 text-xs">View live map</Link>
            </div>
            <IssueMap
              height={410}
              center={{lat: 26.8467, lng: 80.9462}}
              complaints={[
                {complaintId:"CVX-DEMO-01",title:"Streetlight failure",category:"Streetlight",location:{lat:26.851,lng:80.948},ai:{severity:"High"}},
                {complaintId:"CVX-DEMO-02",title:"Road damage",category:"Roads",location:{lat:26.839,lng:80.94},ai:{severity:"Critical"}},
                {complaintId:"CVX-DEMO-03",title:"Drainage blockage",category:"Drainage",location:{lat:26.858,lng:80.952},ai:{severity:"Medium"}},
                {complaintId:"CVX-DEMO-04",title:"Garbage overflow",category:"Garbage",location:{lat:26.832,lng:80.956},ai:{severity:"Low"}},
                {complaintId:"CVX-DEMO-05",title:"Water leakage",category:"Water",location:{lat:26.844,lng:80.961},ai:{severity:"High"}}
              ]}
            />
          </motion.div>

          <div className="grid grid-cols-1 gap-5">
            <div className="card-base p-5">
              <span className="section-eyebrow">Priority Queue</span>
              <div className="mt-5 space-y-3">
                <PriorityPreview level="Critical" score="96" title="Main road damage" meta="Safety risk · Roads" />
                <PriorityPreview level="High" score="88" title="Streetlight corridor" meta="Recurring · Electrical" />
                <PriorityPreview level="Low" score="31" title="Minor waste overflow" meta="Routine · Sanitation" />
              </div>
            </div>
            <div className="card-base p-5">
              <p className="text-[9px] font-bold uppercase tracking-[.16em] text-white/30">How prioritization works</p>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Civi-X weighs safety impact, complaint volume, location density, recurrence and response urgency to decide what needs attention first.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniSignal label="Safety" value="High" />
                <MiniSignal label="Recurrence" value="23" />
                <MiniSignal label="Urgency" value="92" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface via-surface to-accent-indigo/10 px-6 py-14 text-center sm:px-12"
        >
          <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-[500px] -translate-x-1/2 rounded-full bg-accent-indigo/20 blur-[100px]" />
          <div className="relative">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              See it work on a real complaint
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
              Report a sample issue and watch Civi-X analyze, score and route it in seconds.
            </p>
            <Link to="/report" className="btn-primary landing-cta landing-action-primary mt-1 px-7 py-3.5 text-base">
              <ClipboardCheck size={17} />
              Report an Issue
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function PriorityPreview({level,score,title,meta}){
 const tone=level==="Critical"?"critical":level==="High"?"high":"low";
 return <div className="priority-preview">
   <div className={`priority-score ${tone}`}><b>{score}</b><span>/100</span></div>
   <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-white/85">{title}</p><p className="mt-1 text-[10px] text-white/35">{meta}</p></div>
   <span className={`priority-level ${tone}`}>{level}</span>
 </div>
}
function MiniSignal({label,value}){
 return <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5"><p className="text-[8px] uppercase tracking-wider text-white/30">{label}</p><p className="mt-1 text-xs font-bold text-white/80">{value}</p></div>
}
