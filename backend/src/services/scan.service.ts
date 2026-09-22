import {
  randomUUID,
} from "node:crypto";

import {
  Scan,
} from "../models/scan.model.js";

import type {
  CreateScanInput,
} from "../schemas/scan.schema.js";

import {
  ScanStatus,
} from "../types/scan.types.js";

import type {
  RuleFinding,
} from "../rules/types.js";

import {
  saveNetworkEvents,
} from "./event.service.js";

import {
  savePageEvidence,
} from "./evidence.service.js";

import {
  analyzePageRisk,
} from "./risk.service.js";

import {
  saveFindings,
} from "./finding.service.js";

import {
  createReport,
  saveAIAnalysis,
} from "./report.service.js";

import {
  calculateRisk,
} from "../risk/risk-engine.js";

import {
  DockerService,
} from "./docker.service.js";

import {
  analyzeEvidenceWithAI,
} from "./ai.service.js";

import { logger } from "../utils/logger.js";

const dockerService =
  new DockerService();

export async function createScan(
  input: CreateScanInput,
  userId: string,
) {
  const scanId =
    `scan_${randomUUID()}`;

  const scan =
    await Scan.create({
      userId,

      scanId,

      jobUrl:
        input.jobUrl,

      status:
        ScanStatus.QUEUED,
    });

  void runScan(
    scanId,
  );

  return {
    scanId,

    status:
      scan.status,

    jobUrl:
      scan.jobUrl,
  };
}

export async function getScan(
  scanId: string,
  userId: string,
) {
  return Scan.findOne({
    scanId,
    userId,
  }).lean();
}

export async function getUserScans(
  userId: string,
  limit: number = 50,
) {
  return Scan.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

async function runScan(
  scanId: string,
): Promise<void> {
  const scan =
    await Scan.findOne({
      scanId,
    });

  if (!scan) {
    return;
  }

  try {
    await Scan.updateOne(
      {
        scanId,
      },
      {
        $set: {
          status:
            ScanStatus.SCANNING,

          startedAt:
            new Date(),
        },
      },
    );

    const dockerResult =
      await dockerService.runScan({
        scanId,

        jobUrl:
          scan.jobUrl,
      });

    if (
      !dockerResult.success ||
      !dockerResult.evidence
    ) {
      throw new Error(
        dockerResult.error ??
          "Scanner failed",
      );
    }

    const evidence =
      dockerResult.evidence;

    await Scan.updateOne(
      {
        scanId,
      },
      {
        $set: {
          status:
            ScanStatus.ANALYZING,
        },
      },
    );

    const allFindings:
      RuleFinding[] = [];

    let scanStopped =
      false;

    for (
      const page of
        evidence.pages
    ) {
      await saveNetworkEvents(
        scanId,
        page.network,
      );

      await savePageEvidence(
        scanId,
        page,
      );

      const risk =
        analyzePageRisk(
          page,
        );

      await saveFindings(
        scanId,
        risk.findings,
      );

      allFindings.push(
        ...risk.findings,
      );

      if (
        page.stopGuard
          .triggered
      ) {
        scanStopped =
          true;

        break;
      }
    }

    const finalRisk =
      calculateRisk(
        allFindings,
      );

    await createReport(
      scanId,

      scan.jobUrl,

      evidence.pages,

      finalRisk,
    );

    try {
      const aiAnalysis =
        await analyzeEvidenceWithAI({
          scanId,

          jobUrl:
            scan.jobUrl,

          pages:
            evidence.pages,

          ruleFindings:
            allFindings,

          ruleRiskScore:
            finalRisk.score,

          ruleRiskLevel:
            finalRisk.level,
        });

      await saveAIAnalysis(
        scanId,
        aiAnalysis,
      );
    } catch (error) {
      logger.error(
        {
          error,
          scanId,
        },
        "AI analysis failed",
      );
    }

    await Scan.updateOne(
      {
        scanId,
      },
      {
        $set: {
          status:
            scanStopped
              ? ScanStatus.STOPPED
              : ScanStatus.COMPLETED,

          riskScore:
            finalRisk.score,

          riskLevel:
            finalRisk.level,

          completedAt:
            new Date(),

          ...(scanStopped
            ? {
                error:
                  "Scan stopped by Stop Guard before sensitive information could be entered.",
              }
            : {}),
        },
      },
    );
  } catch (error) {
    logger.error(
      {
        error,
        scanId,
      },
      "Scan pipeline failed",
    );

    await Scan.updateOne(
      {
        scanId,
      },
      {
        $set: {
          status:
            ScanStatus.FAILED,

          error:
            error instanceof Error
              ? error.message
              : "Unknown scanner error",

          completedAt:
            new Date(),
        },
      },
    );
  }
}