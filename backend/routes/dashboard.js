import express from "express";
import { getDashboardStats, getPriorityQueue } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/queue", getPriorityQueue);

export default router;
