import Complaint from "../models/Complaint.js";
import { generateComplaintId } from "../utils/generateComplaintId.js";
import { analyzeComplaint } from "../services/aiService.js";
import { findSimilarComplaints, buildClusters } from "../services/clusterService.js";

export async function createComplaint(req, res) {
  try {
    const { title, description, category, location, imageUrl, reporterName, reporterContact } =
      req.body;

    if (!title || !description || !category || !location?.address || location?.lat == null || location?.lng == null) {
      return res.status(400).json({
        message:
          "title, description, category and a valid location (address, lat, lng) are required.",
      });
    }

    const ai = await analyzeComplaint({
      title,
      description,
      category,
      address: location.address,
    });

    const complaintId = generateComplaintId();

    const complaint = await Complaint.create({
      complaintId,
      title,
      description,
      category,
      location,
      imageUrl: imageUrl || null,
      reporterName: reporterName || "Anonymous Citizen",
      reporterContact: reporterContact || "",
      ai,
      status: "Reported",
      timeline: [{ status: "Reported", note: "Complaint submitted by citizen.", at: new Date() }],
    });

    const allComplaints = await Complaint.find({ category }).lean();
    const similar = findSimilarComplaints(
      { ...complaint.toObject() },
      allComplaints,
      5
    );

    res.status(201).json({ complaint, similar });
  } catch (err) {
    console.error("createComplaint error:", err);
    res.status(500).json({ message: "Failed to create complaint.", error: err.message });
  }
}

export async function listComplaints(req, res) {
  try {
    const { search, category, status, severity, sort = "-createdAt", page = 1, limit = 50 } = req.query;

    const query = {};
    if (category && category !== "All") query.category = category;
    if (status && status !== "All") query.status = status;
    if (severity && severity !== "All") query["ai.severity"] = severity;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { complaintId: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
      ];
    }

    const sortMap = {
      "-createdAt": { createdAt: -1 },
      createdAt: { createdAt: 1 },
      "-priority": { "ai.priorityScore": -1 },
      priority: { "ai.priorityScore": 1 },
    };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const [items, total] = await Promise.all([
      Complaint.find(query)
        .sort(sortMap[sort] || sortMap["-createdAt"])
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Complaint.countDocuments(query),
    ]);

    res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    console.error("listComplaints error:", err);
    res.status(500).json({ message: "Failed to fetch complaints.", error: err.message });
  }
}


export async function findComplaintsByLocation(req, res) {
  try {
    const address = String(req.query.address || "").trim();
    if (address.length < 3) {
      return res.status(400).json({ message: "Enter at least 3 characters of a location." });
    }

    const escaped = address.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const items = await Complaint.find({
      "location.address": { $regex: escaped, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .select("complaintId title category location status ai.priorityScore ai.severity createdAt assignedDepartment");

    res.json({ items });
  } catch (err) {
    console.error("findComplaintsByLocation error:", err);
    res.status(500).json({ message: "Failed to search complaints by location." });
  }
}

export async function getComplaint(req, res) {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });

    const allInCategory = await Complaint.find({ category: complaint.category }).lean();
    const similar = findSimilarComplaints(complaint.toObject(), allInCategory, 5);

    const allComplaints = await Complaint.find().lean();
    const clusters = buildClusters(allComplaints);
    const cluster = clusters.find((c) =>
      c.complaints.some((m) => m.complaintId === complaint.complaintId)
    );

    res.json({ complaint, similar, cluster: cluster || null });
  } catch (err) {
    console.error("getComplaint error:", err);
    res.status(500).json({ message: "Failed to fetch complaint.", error: err.message });
  }
}

const STATUS_ORDER = ["Reported", "Verified", "Assigned", "In Progress", "Resolved"];

export async function updateComplaintStatus(req, res) {
  try {
    const { status, note, department } = req.body;
    if (!STATUS_ORDER.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });

    complaint.status = status;
    if (department) {
      complaint.assignedDepartment = department;
      if (!complaint.assignedAt) complaint.assignedAt = new Date();
    }
    if (status === "Assigned" && !complaint.assignedAt) complaint.assignedAt = new Date();
    if (status === "Resolved") {
      complaint.slaProgress = 100;
    } else if (complaint.assignedAt) {
      const elapsed = (Date.now() - new Date(complaint.assignedAt).getTime()) / 60000;
      complaint.slaProgress = Math.max(0, Math.min(99, Math.round((elapsed / (complaint.slaTargetMinutes || 120)) * 100)));
    }
    complaint.timeline.push({
      status,
      note: note || (department ? `Assigned to ${department}.` : ""),
      at: new Date(),
    });
    await complaint.save();

    res.json({ complaint });
  } catch (err) {
    console.error("updateComplaintStatus error:", err);
    res.status(500).json({ message: "Failed to update status.", error: err.message });
  }
}
