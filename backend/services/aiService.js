import fetch from "node-fetch";

const DEPARTMENT_MAP = {
  Pothole: "Roads & Infrastructure Dept.",
  "Damaged Road": "Roads & Infrastructure Dept.",
  Streetlight: "Electrical & Street Lighting Dept.",
  Garbage: "Sanitation & Waste Management Dept.",
  "Water Leakage": "Water Supply Board",
  Drainage: "Storm Water & Drainage Dept.",
  "Illegal Construction": "Urban Planning & Enforcement",
  "Public Nuisance": "Municipal Enforcement Cell",
  Other: "General Administration",
};

const ACTION_MAP = {
  Pothole: "Dispatch road repair crew to fill and resurface the affected stretch.",
  "Damaged Road": "Schedule structural assessment and resurfacing works.",
  Streetlight: "Send electrical maintenance team to inspect wiring and replace faulty fixtures.",
  Garbage: "Route additional waste collection vehicle and notify sanitation supervisor.",
  "Water Leakage": "Deploy pipeline inspection team to locate and seal the leak.",
  Drainage: "Clear blockage and inspect drainage capacity before next rainfall.",
  "Illegal Construction": "Issue site inspection notice to enforcement officer.",
  "Public Nuisance": "Assign field officer to assess and mediate the reported nuisance.",
  Other: "Route to general administration for triage and department assignment.",
};

const SEVERITY_KEYWORDS = {
  Critical: [
    "accident",
    "danger",
    "dangerous",
    "collapsed",
    "electrocut",
    "fire",
    "injur",
    "flood",
    "sewage overflow",
    "child",
    "school",
    "hospital",
    "exposed wire",
    "live wire",
  ],
  High: [
    "major",
    "huge",
    "large",
    "weeks",
    "months",
    "overflowing",
    "burst",
    "blocked",
    "no light",
    "dark",
    "traffic",
    "deep",
    "heavy",
  ],
  Medium: ["small", "minor road", "slow leak", "occasional", "partial"],
};

function scoreSeverity(text) {
  const lower = text.toLowerCase();
  for (const level of ["Critical", "High", "Medium"]) {
    if (SEVERITY_KEYWORDS[level].some((kw) => lower.includes(kw))) return level;
  }
  return "Low";
}

const CATEGORY_BASE_WEIGHT = {
  Pothole: 55,
  "Damaged Road": 55,
  Streetlight: 45,
  Garbage: 40,
  "Water Leakage": 60,
  Drainage: 58,
  "Illegal Construction": 35,
  "Public Nuisance": 30,
  Other: 25,
};

const SEVERITY_WEIGHT = { Low: 0, Medium: 12, High: 26, Critical: 40 };

/**
 * Rule-based deterministic AI simulation. Always available, no external
 * dependency, and fast — used as the default engine and as a safety-net
 * fallback if the LLM call fails or no API key is configured.
 */
function ruleBasedAnalysis({ title, description, category }) {
  const text = `${title} ${description}`;
  const severity = scoreSeverity(text);
  const base = CATEGORY_BASE_WEIGHT[category] ?? 30;
  const bump = SEVERITY_WEIGHT[severity] ?? 0;
  const lengthSignal = Math.min(10, Math.floor(description.length / 60));
  const priorityScore = Math.max(5, Math.min(99, base + bump + lengthSignal));

  const summary = `${category} issue reported${
    severity === "Critical" || severity === "High" ? " requiring urgent attention" : ""
  }: ${description.slice(0, 140)}${description.length > 140 ? "…" : ""}`;

  return {
    severity,
    priorityScore,
    summary,
    department: DEPARTMENT_MAP[category] ?? "General Administration",
    recommendedAction: ACTION_MAP[category] ?? ACTION_MAP.Other,
    tags: [category.toLowerCase().replace(/\s+/g, "-"), severity.toLowerCase()],
    confidence: 78,
    source: "rule-based",
  };
}

/**
 * Attempts a real LLM call via Groq's OpenAI-compatible chat completions
 * endpoint. Returns null on any failure so the caller can fall back
 * gracefully to the rule-based engine — the demo never breaks.
 */
async function llmAnalysis({ title, description, category, address }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const prompt = `You are Civi-X, an AI civic issue triage engine for a municipal government.
Analyze the following citizen complaint and respond with STRICT JSON only, no markdown, no preamble.

Complaint title: ${title}
Category: ${category}
Location: ${address}
Description: ${description}

Return JSON with exactly these keys:
{
  "severity": "Low" | "Medium" | "High" | "Critical",
  "priorityScore": number from 0 to 100,
  "summary": "one crisp sentence summarizing the issue for an admin dashboard",
  "department": "the most appropriate municipal department to handle this",
  "recommendedAction": "one concrete, actionable next step for field staff",
  "tags": ["short", "lowercase", "keywords"],
  "confidence": number from 0 to 100 representing your confidence in this analysis
}`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return {
      severity: ["Low", "Medium", "High", "Critical"].includes(parsed.severity)
        ? parsed.severity
        : "Medium",
      priorityScore: Math.max(0, Math.min(100, Math.round(Number(parsed.priorityScore) || 50))),
      summary: String(parsed.summary || "").slice(0, 280),
      department: String(parsed.department || DEPARTMENT_MAP[category] || "General Administration"),
      recommendedAction: String(parsed.recommendedAction || ACTION_MAP[category] || ACTION_MAP.Other),
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : [],
      confidence: Math.max(0, Math.min(100, Math.round(Number(parsed.confidence) || 85))),
      source: "llm",
    };
  } catch (err) {
    console.warn("[Civi-X] Groq LLM analysis failed, using rule-based fallback:", err.message);
    return null;
  }
}

export async function analyzeComplaint(complaintInput) {
  const llmResult = await llmAnalysis(complaintInput);
  if (llmResult) return llmResult;
  return ruleBasedAnalysis(complaintInput);
}

export function generateInsights(complaints) {
  if (!complaints.length) {
    return {
      headline: "No data yet",
      points: [],
    };
  }

  const byCategory = {};
  const byDept = {};
  let critical = 0;
  for (const c of complaints) {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    const dept = c.ai?.department || "General Administration";
    byDept[dept] = (byDept[dept] || 0) + 1;
    if (c.ai?.severity === "Critical") critical += 1;
  }

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  const topDept = Object.entries(byDept).sort((a, b) => b[1] - a[1])[0];
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const resolutionRate = Math.round((resolved / complaints.length) * 100);

  const points = [
    topCategory &&
      `${topCategory[0]} complaints dominate this period with ${topCategory[1]} reports (${Math.round(
        (topCategory[1] / complaints.length) * 100
      )}% of total volume).`,
    topDept && `${topDept[0]} currently holds the largest share of active work at ${topDept[1]} assigned issues.`,
    `${critical} complaint${critical === 1 ? "" : "s"} flagged Critical severity — recommend immediate field dispatch.`,
    `Overall resolution rate stands at ${resolutionRate}%, ${
      resolutionRate >= 60 ? "tracking well against target." : "below target — consider reallocating field crews."
    }`,
  ].filter(Boolean);

  return {
    headline: `${complaints.length} active civic signals analyzed across ${Object.keys(byCategory).length} categories`,
    points,
  };
}
