import mongoose from "mongoose";

const timelineEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Reported", "Verified", "Assigned", "In Progress", "Resolved"],
      required: true,
    },
    note: { type: String, default: "" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true, index: true },

    // Citizen-provided fields
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Pothole",
        "Streetlight",
        "Garbage",
        "Water Leakage",
        "Drainage",
        "Damaged Road",
        "Illegal Construction",
        "Public Nuisance",
        "Other",
      ],
    },
    location: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    imageUrl: { type: String, default: null },
    reporterName: { type: String, default: "Anonymous Citizen" },
    reporterContact: { type: String, default: "" },

    // AI analysis output
    ai: {
      severity: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Medium",
      },
      priorityScore: { type: Number, min: 0, max: 100, default: 50 },
      summary: { type: String, default: "" },
      department: { type: String, default: "General Administration" },
      recommendedAction: { type: String, default: "" },
      tags: { type: [String], default: [] },
      confidence: { type: Number, min: 0, max: 100, default: 80 },
      source: { type: String, enum: ["llm", "rule-based"], default: "rule-based" },
    },

    // Operations state
    assignedDepartment: { type: String, default: null },
    assignedAt: { type: Date, default: null },
    slaTargetMinutes: { type: Number, default: 120 },
    slaProgress: { type: Number, default: 0, min: 0, max: 100 },

    // Cluster linkage (populated by clustering service)
    clusterId: { type: String, default: null, index: true },

    status: {
      type: String,
      enum: ["Reported", "Verified", "Assigned", "In Progress", "Resolved"],
      default: "Reported",
    },
    timeline: { type: [timelineEventSchema], default: [] },
  },
  { timestamps: true }
);

complaintSchema.index({ "location.lat": 1, "location.lng": 1 });
complaintSchema.index({ title: "text", description: "text" });

export default mongoose.model("Complaint", complaintSchema);
