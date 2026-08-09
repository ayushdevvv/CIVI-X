import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import complaintsRouter from "./routes/complaints.js";
import dashboardRouter from "./routes/dashboard.js";
import clustersRouter from "./routes/clusters.js";
import insightsRouter from "./routes/insights.js";
import helplineRouter from "./routes/helpline.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Civi-X API", time: new Date().toISOString() });
});

app.use("/api/complaints", complaintsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/clusters", clustersRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/helpline", helplineRouter);

// 404
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error." });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Civi-X] API server running on http://localhost:${PORT}`);
  });
});
