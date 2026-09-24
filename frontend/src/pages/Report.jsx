import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CircleAlert,
  LoaderCircle,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { scanApi } from "../services/scan.api";
import { reportApi } from "../services/report.api";
import { findingApi } from "../services/finding.api";

import Layout from "../components/layout/Layout";

export default function Report() {
  const { scanId } = useParams();

  const [scan, setScan] = useState(null);
  const [report, setReport] = useState(null);
  const [findings, setFindings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!scanId) {
      setError("Scan ID is missing.");
      setLoading(false);
      return;
    }

    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          scanResponse,
          reportResponse,
          findingsResponse,
        ] = await Promise.all([
          scanApi.get(scanId),
          reportApi.get(scanId),
          findingApi.get(scanId).catch(() => ({
            data: [],
          })),
        ]);

        setScan(scanResponse?.data ?? null);
        setReport(reportResponse?.data ?? null);

        setFindings(
          Array.isArray(findingsResponse?.data)
            ? findingsResponse.data
            : []
        );
      } catch (err) {
        setError(
          err?.message ||
            "Unable to load the scan report."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [scanId]);

  if (loading) {
    return (
      <Layout>
        <section className="flex min-h-[70vh] items-center justify-center px-5">
          <div className="text-center">
            <LoaderCircle
              className="mx-auto animate-spin text-[#08ad50]"
              size={40}
            />

            <p className="mt-4 text-sm font-semibold text-slate-500">
              Loading scan report...
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <section className="mx-auto max-w-2xl px-5 py-20">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <CircleAlert
              className="mx-auto text-red-600"
              size={42}
            />

            <h1 className="mt-4 font-display text-2xl font-bold text-red-800">
              Unable to Load Report
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <Link
              to="/history"
              className="mt-6 inline-flex rounded-xl bg-[#078e42] px-5 py-3 text-sm font-bold text-white"
            >
              Back to History
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  /*
   * Report is the source of truth.
   */
  const reportFindings = Array.isArray(
    report?.findings
  )
    ? report.findings
    : [];

  const allFindings =
    reportFindings.length > 0
      ? reportFindings
      : findings;

  const score =
    typeof report?.riskScore === "number"
      ? report.riskScore
      : typeof report?.risk_score === "number"
        ? report.risk_score
        : allFindings.reduce(
            (total, finding) =>
              total +
              (typeof finding?.score === "number"
                ? finding.score
                : 0),
            0
          );

  const rawLevel =
    report?.riskLevel ??
    report?.risk_level ??
    scan?.riskLevel ??
    scan?.risk_level ??
    "EVALUATING";

  const level = String(rawLevel).toUpperCase();

  const isCritical =
    level === "CRITICAL";

  const isHigh =
    level === "HIGH";

  const isMedium =
    level === "MEDIUM";

  const scoreColor =
    isCritical || isHigh
      ? "text-red-600"
      : isMedium
        ? "text-amber-600"
        : "text-[#08ad50]";

  const badgeColor =
    isCritical || isHigh
      ? "border-red-200 bg-red-50 text-red-700"
      : isMedium
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-[#c9efd6] bg-[#eafff1] text-[#08783b]";

  const summary =
    report?.summary ||
    report?.aiAnalysis?.summary ||
    "No summary is available for this scan.";

  const recommendedAction =
    report?.recommendedAction ||
    report?.recommended_action ||
    report?.aiAnalysis?.recommended_action ||
    report?.aiAnalysis?.recommendedAction ||
    "";

  return (
    <Layout>
      <main className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
        {/* Back */}
        <Link
          to="/scan"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#08ad50]"
        >
          <ArrowLeft size={17} />
          Back to Scanner
        </Link>

        {/* Header */}
        <section className="mt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#08ad50]">
                JobGuard AI Report
              </p>

              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Scan Report
              </h1>

              {scan?.jobUrl && (
                <p className="mt-3 max-w-3xl break-all text-sm leading-6 text-slate-500">
                  {scan.jobUrl}
                </p>
              )}
            </div>

            <div
              className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-wide ${badgeColor}`}
            >
              {isHigh || isCritical ? (
                <TriangleAlert size={16} />
              ) : (
                <ShieldCheck size={16} />
              )}

              {level} RISK
            </div>
          </div>
        </section>

        {/* Score + summary */}
        <section className="mt-8 grid gap-5 md:grid-cols-[240px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Risk Score
            </p>

            <p
              className={`mt-3 font-display text-7xl font-black ${scoreColor}`}
            >
              {score}
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-400">
              out of 100
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Assessment Summary
            </p>

            <h2 className="mt-3 font-display text-2xl font-bold">
              {level} risk detected
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              {summary}
            </p>

            {recommendedAction && (
              <div className="mt-6 rounded-2xl border border-[#c9efd6] bg-[#f4fff8] p-5">
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#078e42]">
                  Recommended Action
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {recommendedAction}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Findings */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Investigation
              </p>

              <h2 className="mt-2 font-display text-2xl font-bold">
                Findings
              </h2>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
              {allFindings.length}
            </span>
          </div>

          {allFindings.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center">
              <ShieldCheck
                className="mx-auto text-[#08ad50]"
                size={32}
              />

              <p className="mt-3 text-sm font-semibold text-slate-600">
                No suspicious findings were reported.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {allFindings.map(
                (finding, index) => {
                  const findingScore =
                    typeof finding?.score === "number"
                      ? finding.score
                      : null;

                  const title =
                    finding?.title ||
                    finding?.name ||
                    finding?.type ||
                    "Suspicious Signal";

                  const explanation =
                    finding?.explanation ||
                    finding?.description ||
                    finding?.message ||
                    finding?.evidence ||
                    "Suspicious activity detected.";

                  return (
                    <article
                      key={
                        finding?._id ||
                        finding?.id ||
                        `${title}-${index}`
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <h3 className="font-bold text-slate-800">
                            {title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {explanation}
                          </p>
                        </div>

                        {findingScore !== null && (
                          <span className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-extrabold text-slate-700">
                            +{findingScore}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {finding?.severity && (
                          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            {finding.severity}
                          </span>
                        )}

                        {finding?.type && (
                          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            {finding.type}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* Scan details */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Scan Details
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Detail
              label="Status"
              value={scan?.status}
            />

            <Detail
              label="Scan ID"
              value={scan?.scanId}
            />

            <Detail
              label="Started"
              value={
                scan?.startedAt
                  ? new Date(
                      scan.startedAt
                    ).toLocaleString()
                  : "—"
              }
            />

            <Detail
              label="Completed"
              value={
                scan?.completedAt
                  ? new Date(
                      scan.completedAt
                    ).toLocaleString()
                  : "—"
              }
            />
          </div>
        </section>
      </main>
    </Layout>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-all text-sm font-bold text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}