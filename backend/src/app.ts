import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import scanRoutes from "./routes/scan.routes.js";
import reportRoutes from "./routes/report.routes.js";
import evidenceRoutes from "./routes/evidence.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = new Set([
  env.CORS_ORIGIN,
  ...(env.NODE_ENV === "development"
    ? [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ]
    : []),
]);

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      callback(null, allowedOrigins.has(origin));
    },
    credentials: true,
  }),
);

app.use(
  pinoHttp({
    logger,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(
  "/api/v1/health",
  healthRoutes,
);

app.use(
  "/api/v1/auth",
  authRoutes,
);

app.use(
  "/api/v1/scans",
  scanRoutes,
);

app.use(
  "/api/v1/reports",
  reportRoutes,
);

app.use(
  "/api/v1/scans",
  evidenceRoutes,
);

app.use(
  "/api/v1/ai",
  aiRoutes,
);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "JobGuard AI API is running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

app.use(errorMiddleware);

export default app;