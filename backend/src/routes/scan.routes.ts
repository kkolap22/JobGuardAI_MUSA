import { Router } from "express";

import {
  createScanController,
  getScanController,
  getUserScansController,
} from "../controllers/scan.controller.js";

import {
  requireAuth,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  createScanController,
);

router.get(
  "/",
  requireAuth,
  getUserScansController,
);

router.get(
  "/:scanId",
  requireAuth,
  getScanController,
);

export default router;