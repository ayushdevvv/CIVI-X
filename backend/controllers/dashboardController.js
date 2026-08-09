import Complaint from "../models/Complaint.js";
import { buildClusters } from "../services/clusterService.js";
import { generateInsights } from "../services/aiService.js";

export async function getDashboardStats(req, res) {
  try {
    const all = await Complaint.find().lean();

    const total = all.length;
    const critical = all.filter((c) => c.ai?.severity === "Critical").length;
    const pending = all.filter((c) => c.status === "Reported" || c.status === "Verified").length;
    const inProgress = all.filter(
      (c) => c.status === "Assigned" || c.status === "In Progress"
    ).length;
    const resolved = all.filter((c) => c.status === "Resolved").length;

    const byCategory = {};
    const bySeverity = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    const byStatus = { Reported: 0, Verified: 0, Assigned: 0, "In Progress": 0, Resolved: 0 };
    const byDepartment = {};

    for (const c of all) {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
      if (c.ai?.severity) bySeverity[c.ai.severity] = (bySeverity[c.ai.severity] || 0) + 1;
      if (c.status) byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      const dept = c.ai?.department || "General Administration";
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
    }

    // last 14 days trend
    const trendMap = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      trendMap[key] = { date: key, reported: 0, resolved: 0 };
    }
    for (const c of all) {
      const key = new Date(c.createdAt).toISOString().slice(0, 10);
      if (trendMap[key]) trendMap[key].reported += 1;
      if (c.status === "Resolved") {
        const resolvedEvent = c.timeline?.find((t) => t.status === "Resolved");
        const rKey = resolvedEvent
          ? new Date(resolvedEvent.at).toISOString().slice(0, 10)
          : null;
        if (rKey && trendMap[rKey]) trendMap[rKey].resolved += 1;
      }
    }

    res.json({
      totals: { total, critical, pending, inProgress, resolved },
      byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
      bySeverity: Object.entries(bySeverity).map(([name, value]) => ({ name, value })),
      byStatus: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
      byDepartment: Object.entries(byDepartment)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      trend: Object.values(trendMap),
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    res.status(500).json({ message: "Failed to compute dashboard stats.", error: err.message });
  }
}

export async function getPriorityQueue(req, res) {
  try {
    const items = await Complaint.find({ status: { $ne: "Resolved" } })
      .sort({ "ai.priorityScore": -1, createdAt: 1 })
      .limit(25);
    res.json({ items });
  } catch (err) {
    console.error("getPriorityQueue error:", err);
    res.status(500).json({ message: "Failed to fetch priority queue.", error: err.message });
  }
}

export async function getClusters(req, res) {
  try {
    const all = await Complaint.find().lean();
    const clusters = buildClusters(all);
    res.json({ clusters });
  } catch (err) {
    console.error("getClusters error:", err);
    res.status(500).json({ message: "Failed to compute clusters.", error: err.message });
  }
}

export async function getInsights(req, res) {
  try {
    const all = await Complaint.find().lean();
    const insights = generateInsights(all);
    const clusters = buildClusters(all);
    res.json({
      ...insights,
      clusterHighlights: clusters.slice(0, 3).map((c) => ({
        clusterId: c.clusterId,
        title: c.title,
        reportCount: c.reportCount,
        priority: c.priority,
        narrative: c.narrative,
      })),
    });
  } catch (err) {
    console.error("getInsights error:", err);
    res.status(500).json({ message: "Failed to generate insights.", error: err.message });
  }
}
