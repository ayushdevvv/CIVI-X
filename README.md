# Civi-X — AI-Powered Civic Issue Intelligence Platform

Civi-X lets citizens report civic problems (potholes, broken streetlights,
garbage, water leakage, drainage, damaged roads, etc.) and uses AI to
analyze each complaint: classify severity, assign a 0–100 priority score,
recommend the right department and action, detect similar nearby reports,
and cluster recurring issues across the city — surfaced live in an admin
command center.

**Core flow:** Report Issue → AI Analysis → Priority Score → Similar Issues →
Admin Action → Resolution Tracking.

---

## Tech stack

- **Frontend:** React + Vite, Tailwind CSS, Framer Motion, Lucide React, Recharts, React Leaflet
- **Backend:** Node.js + Express, MongoDB + Mongoose
- **AI:** Groq LLM API (optional) with an always-on rule-based fallback engine
- **Deployment target:** Frontend → Vercel, Backend → Render

---

## Project structure

```
civi-x/
├── backend/                 Express API + MongoDB models + AI/clustering services
│   ├── config/db.js
│   ├── models/Complaint.js
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   │   ├── aiService.js         Groq LLM call + rule-based fallback analysis
│   │   └── clusterService.js    Geo + category clustering ("signature feature")
│   ├── seed/                    Demo data generator + seed script
│   └── server.js
└── frontend/                Vite + React app
    └── src/
        ├── pages/                Landing, ReportIssue, TrackComplaint, Explorer
        ├── pages/admin/          Admin command center (dashboard, queue, clusters, insights)
        ├── components/           Reusable UI: cards, badges, charts, map, timeline…
        └── api/client.js         Axios client for the backend API
```

---

## 1. Prerequisites

- Node.js 18+
- A MongoDB database — either:
  - **Local:** install MongoDB Community Server and run it on `mongodb://127.0.0.1:27017`, or
  - **Cloud (recommended, free):** create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and copy its connection string.

You do **not** need a Groq API key to run the demo — Civi-X automatically
falls back to a fast, deterministic rule-based AI engine when no key is
configured, so every feature works fully offline. Adding a free key from
[console.groq.com](https://console.groq.com) upgrades the analysis to a real
LLM with zero code changes.

---

## 2. Setup

```bash
# From the civi-x/ root
cd backend
cp .env.example .env      # edit MONGO_URI if using Atlas, add GROQ_API_KEY (optional)
npm install

cd ../frontend
cp .env.example .env      # defaults to http://localhost:5000/api — fine for local dev
npm install
```

## 3. Seed realistic demo data

This populates ~46 realistic complaints around Lucknow with deliberate
geographic "hot spots" so the dashboard, charts, and — most importantly —
the recurring issue clusters look alive immediately.

```bash
cd backend
npm run seed
```

## 4. Run the app

Open two terminals:

```bash
# Terminal 1
cd backend
npm run dev        # API on http://localhost:5000

# Terminal 2
cd frontend
npm run dev         # App on http://localhost:5173
```

Or, from the repo root, install `concurrently` once and run both together:

```bash
npm run install:all
npm run dev
```

---

## 5. Demo walkthrough (for judges)

1. Open `http://localhost:5173` → land on the premium landing page.
2. Click **Get Started** → choose **Report an Issue**.
3. Fill the form (title, description, category, pin a location on the map,
   optional photo) and submit.
4. Watch the live AI-analysis animation, then see the **priority score,
   severity, department, recommended action** and a **unique complaint ID**.
5. Click **Track this complaint** to see the live status timeline.
6. Go back home → **Get Started → Resolve Issues** to open the **Admin
   Command Center**.
7. On the **Overview** tab, see dashboard stats and charts update instantly.
8. Open **Priority Queue** — the new issue appears ranked by AI priority.
9. Open **Issue Clusters** — related complaints (e.g. streetlight failures
   along the same corridor) are grouped automatically with a recommended
   consolidated action.
10. Open **AI Insights** for a narrative summary of citywide patterns.
11. Advance a complaint's status (Reported → Verified → Assigned → In
    Progress → Resolved) directly from the queue or its detail page, and
    watch the citizen-facing timeline update in real time.

---

## API reference

| Method | Endpoint                          | Description                             |
|--------|------------------------------------|------------------------------------------|
| POST   | `/api/complaints`                  | Create a complaint (runs AI analysis)    |
| GET    | `/api/complaints`                  | List complaints (search/filter/sort)     |
| GET    | `/api/complaints/:id`              | Get one complaint + similar + cluster    |
| PATCH  | `/api/complaints/:id/status`       | Advance a complaint's status             |
| GET    | `/api/dashboard/stats`             | Aggregated dashboard statistics          |
| GET    | `/api/dashboard/queue`             | Top 25 open issues by priority score     |
| GET    | `/api/clusters`                    | AI-detected recurring issue clusters     |
| GET    | `/api/insights`                    | AI-generated civic insights summary      |

---

## Deployment notes

- **Backend → Render:** create a Web Service pointed at `backend/`, set
  `MONGO_URI`, `CLIENT_ORIGIN` (your deployed frontend URL), and optionally
  `GROQ_API_KEY` as environment variables. Start command: `npm start`.
- **Frontend → Vercel:** import `frontend/` as the project root, set
  `VITE_API_URL` to your deployed backend's `/api` URL, build command
  `npm run build`, output directory `dist`.

---

## Design system

Deep navy/near-black base with subtle indigo → blue gradients, glass-blur
surfaces used selectively, thin borders, soft glows, and Manrope/Inter
typography — built to feel like a modern AI SaaS + civic-tech command
center rather than a government portal. Fully responsive from mobile up
to desktop, with reduced-motion support and visible keyboard focus states.
