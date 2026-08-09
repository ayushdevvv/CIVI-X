import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Complaint from "../models/Complaint.js";
import { generateComplaintId } from "../utils/generateComplaintId.js";
import { analyzeComplaint } from "../services/aiService.js";
import { generateSeedComplaints } from "./seedData.js";

dotenv.config();

async function run() {
  await connectDB();

  console.log("[Civi-X] Clearing existing complaints...");
  await Complaint.deleteMany({});

  const seedComplaints = generateSeedComplaints(46);
  console.log(`[Civi-X] Generating AI analysis for ${seedComplaints.length} demo complaints...`);

  const docs = [];
  for (const item of seedComplaints) {
    const ai = await analyzeComplaint({
      title: item.title,
      description: item.description,
      category: item.category,
      address: item.location.address,
    });

    docs.push({
      complaintId: generateComplaintId(),
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      reporterName: item.reporterName,
      reporterContact: item.reporterContact,
      ai,
      status: item.status,
      timeline: item.timeline,
      createdAt: item.createdAt,
      updatedAt: item.timeline[item.timeline.length - 1]?.at || item.createdAt,
    });
  }

  // Use the raw driver insertMany (bypassing Mongoose's timestamps middleware)
  // so our deliberately-spread historical createdAt/updatedAt values are
  // preserved exactly as generated, giving the trend chart realistic history.
  await Complaint.collection.insertMany(docs);
  console.log(`[Civi-X] Seeded ${docs.length} complaints successfully.`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("[Civi-X] Seed failed:", err);
  process.exit(1);
});
