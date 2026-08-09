import express from "express";
import {
  createComplaint,
  listComplaints,
  getComplaint,
  findComplaintsByLocation,
  updateComplaintStatus,
} from "../controllers/complaintController.js";

const router = express.Router();

router.post("/", createComplaint);
router.get("/", listComplaints);
router.get("/location/search", findComplaintsByLocation);
router.get("/:id", getComplaint);
router.patch("/:id/status", updateComplaintStatus);

export default router;
