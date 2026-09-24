import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CircleAlert,
  Link2,
  LoaderCircle,
  LockKeyhole,
  Radar,
  Search,
} from "lucide-react";

import { scanApi } from "../services/scan.api";
import { reportApi } from "../services/report.api";
import { findingApi } from "../services/finding.api";

import { validateJobUrl } from "../utils/validators";

import Layout from "../components/layout/Layout";
import Tag from "../components/common/Tag";
import Result from "../components/scan/Result";

const green = "text-[#08ad50]";

const button =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#078e42] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#08ad50]/20 transition hover:-translate-y-0.5 hover:bg-[#06783a] disabled:cursor-not-allowed disabled:opacity-60";

const TERMINAL_STATUSES = [
  "COMPLETED",
  "FAILED",
  "STOPPED",
];

export default function Scan() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [scan, setScan] = useState(null);
  const [report, setReport] = useState(null);
  const [findings, setFindings] = useState([]);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  /*
   * Load the complete result.
   *
   * IMPORTANT:
   * Report is the source of truth for riskScore/riskLevel.
   */
  const loadResult = async (scanId) => {
    const [scanResponse, reportResponse, findingsResponse] =
      await Promise.all([
        scanApi.get(scanId),

        reportApi.get(scanId).catch(() => ({
          data: null,
        })),

        findingApi.get(scanId).catch(() => ({
          data: [],
        })),
      ]);

    const scanData = scanResponse?.data ?? null;
    const reportData = reportResponse?.data ?? null;
    const findingsData = Array.isArray(findingsResponse?.data)
      ? findingsResponse.data
      : [];

    setScan(scanData);
    setReport(reportData);
    setFindings(findingsData);

    return {
      scan: scanData,
      report: reportData,
      findings: findingsData,
    };
  };

  /*
   * Load an existing scan from:
   *
   * /scan?scanId=xxxxx
   */
  useEffect(() => {
    const scanId = params.get("scanId");

    if (!scanId) {
      return;
    }

    setError("");

    loadResult(scanId).catch((err) => {
      setError(
        err?.message || "Unable to load scan result."
      );
    });
  }, [params]);

  /*
   * Start a new scan.
   */
  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setScan(null);
    setReport(null);
    setFindings([]);
    setProgress(0);

    const validation = validateJobUrl(url);

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    setProgress(10);

    try {
      /*
       * POST /api/v1/scans
       */
      const created = await scanApi.create(url.trim());

      const scanId =
        created?.data?.scanId ||
        created?.data?.scan_id;

      if (!scanId) {
        throw new Error(
          "Backend did not return a scan ID."
        );
      }

      setProgress(15);

      let completed = false;
      let latestScan = null;

      /*
       * Poll:
       *
       * GET /api/v1/scans/:scanId
       */
      for (
        let attempt = 0;
        attempt < 60 && !completed;
        attempt++
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, 2000)
        );

        setProgress(
          Math.min(92, 18 + attempt * 4)
        );

        const currentResponse =
          await scanApi.get(scanId);

        latestScan = currentResponse?.data ?? null;

        if (!latestScan) {
          throw new Error(
            "Invalid scan response from backend."
          );
        }

        setScan(latestScan);

        completed = TERMINAL_STATUSES.includes(
          latestScan.status
        );
      }

      if (!completed) {
        throw new Error(
          "Scan timed out. Please check History for the result."
        );
      }

      /*
       * Load final report + findings.
       */
      await loadResult(scanId);

      setProgress(100);

      /*
       * Keep the result visible on this page.
       * User can also open the full report.
       */
    } catch (err) {
      setError(
        err?.message ||
          "Something went wrong while scanning the job."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * FINAL RISK CALCULATION
   * ============================================================
   *
   * Backend report is the primary source.
   *
   * Example backend:
   * riskScore: 25
   * riskLevel: "MEDIUM"
   *
   * This prevents the old frontend from showing:
   * 50 HIGH RISK
   */
  const reportFindings = Array.isArray(report?.findings)
    ? report.findings
    : [];

  const fallbackFindings =
    reportFindings.length > 0
      ? reportFindings
      : findings;

  const reportScore =
    typeof report?.riskScore === "number"
      ? report.riskScore
      : typeof report?.risk_score === "number"
        ? report.risk_score
        : fallbackFindings.reduce(
            (total, finding) =>
              total +
              (typeof finding?.score === "number"
                ? finding.score
                : 0),
            0
          );

  const scanScore =
    typeof scan?.riskScore === "number"
      ? scan.riskScore
      : typeof scan?.risk_score === "number"
        ? scan.risk_score
        : 0;

  const score = Math.max(
    0,
    Math.min(
      100,
      reportScore || scanScore
    )
  );

  const rawLevel =
    report?.riskLevel ??
    report?.risk_level ??
    scan?.riskLevel ??
    scan?.risk_level ??
    "EVALUATING";

  const level = String(rawLevel).toUpperCase();

  const risk =
    level === "HIGH" ||
    level === "CRITICAL"
      ? "danger"
      : level === "MEDIUM"
        ? "warn"
        : "safe";

  const openFullReport = () => {
    if (!scan?.scanId) {
      return;
    }

    navigate(
      `/report/${encodeURIComponent(
        scan.scanId
      )}`
    );
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-5 py-16 text-center">
        <Tag>AI-POWERED JOB SAFETY</Tag>

        <h1 className="mt-6 font-display text-5xl font-bold tracking-tight sm:text-7xl">
          Check a Job
          <br />
          <span className={green}>
            Before You Apply.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">
          Paste a job posting URL and JobGuard+ will
          investigate its behaviour, redirects and
          suspicious signals.
        </p>
      </section>

      {/* Scanner */}
      <section className="mx-auto max-w-3xl px-5 pb-20">
        <form
          onSubmit={submit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-10"
        >
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#eafff1] text-[#08ad50]">
              <Search />
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold">
                Scan Job Posting
              </h2>

              <p className="text-sm text-slate-500">
                Enter the job posting URL below to
                begin.
              </p>
            </div>
          </div>

          <label className="mt-8 block text-sm font-bold">
            Job Posting URL

            <div className="mt-2 flex h-14 items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-[#08ad50] focus-within:ring-4 focus-within:ring-[#08ad50]/10">
              <Link2
                className="text-slate-400"
                size={19}
              />

              <input
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                type="url"
                placeholder="https://example.com/job/software-developer"
                className="w-full outline-none"
                disabled={loading}
              />
            </div>
          </label>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <CircleAlert size={17} />
              <span>{error}</span>
            </div>
          )}

          {/* Scan button */}
          <button
            type="submit"
            disabled={loading}
            className={`${button} mt-6 h-14 w-full text-base`}
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" />
                Analyzing... {progress}%
              </>
            ) : (
              <>
                <Radar size={19} />
                Scan Job
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Progress */}
          {loading && (
            <div className="mt-5">
              <div className="h-2 overflow-hidden rounded-full bg-[#dff3e6]">
                <div
                  className="h-full rounded-full bg-[#08ad50] transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-center text-xs text-slate-400">
                JobGuard AI is investigating the
                posting...
              </p>
            </div>
          )}

          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <LockKeyhole size={14} />
            Securely processed in an isolated sandbox.
          </p>
        </form>

        {/* Result */}
        {scan && (
          <div className="mt-8">
            <Result
              scan={scan}
              report={report}
              findings={fallbackFindings}
              risk={risk}
              score={score}
              level={level}
            />

            {/* Full report */}
            {scan.scanId && (
              <button
                type="button"
                onClick={openFullReport}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-[#08ad50] hover:text-[#078e42]"
              >
                View Full Report
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
}