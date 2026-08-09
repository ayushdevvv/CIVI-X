import express from "express";
import { getClusters } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", getClusters);

export default router;
