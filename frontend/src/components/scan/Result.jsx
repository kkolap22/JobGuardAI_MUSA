import { Link } from "react-router-dom";
import {
  ArrowRight,
  CircleAlert,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

export default function Result({
  scan,
  report,
  findings = [],
  score = 0,
  level = "EVALUATING",
}) {
  const failed =
    scan?.status === "FAILED";

  const stopped =
    scan?.status === "STOPPED";

  /*
   * Report findings are preferred because the report
   * is the final backend result.
   */
  const reportFindings = Array.isArray(
    report?.findings
  )
    ? report.findings
    : [];

  const allFindings =
    reportFindings.length > 0
      ? reportFindings
      : Array.isArray(findings)
        ? findings
        : [];

  /*
   * Always display the final backend risk.
   * No score calculation is performed here.
   */
  const displayScore = failed
    ? null
    : Number.isFinite(Number(score))
      ? Number(score)
      : 0;

  const displayLevel = failed
    ? "SCAN FAILED"
    : String(level || "EVALUATING").toUpperCase();

  const isDanger =
    displayLevel === "HIGH" ||
    displayLevel === "CRITICAL";

  const isMedium =
    displayLevel === "MEDIUM";

  const badgeClass = failed
    ? "bg-red-50 text-red-700 border-red-200"
    : isDanger
      ? "bg-red-50 text-red-700 border-red-200"
      : isMedium
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-[#eafff1] text-[#08783b] border-[#c9efd6]";

  const scoreClass = failed
    ? "text-red-600"
    : isDanger
      ? "text-red-600"
      : isMedium
        ? "text-amber-600"
        : "text-[#08ad50]";

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
      {/* Header */}
      <div className="border-b border-slate-100 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Scan Result
            </p>

            <h2 className="mt-2 font-display text-2xl font-bold">
              Job Safety Analysis
            </h2>

            {scan?.jobUrl && (
              <p className="mt-2 max-w-xl truncate text-sm text-slate-500">
                {scan.jobUrl}
              </p>
            )}
          </div>

          <div
            className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-wide ${badgeClass}`}
          >
            {failed ? (
              <CircleAlert size={15} />
            ) : isDanger ? (
              <TriangleAlert size={15} />
            ) : (
              <ShieldCheck size={15} />
            )}

            {displayLevel}
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="grid gap-6 p-6 sm:grid-cols-[180px_1fr] sm:p-8">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Risk Score
          </span>

          <strong
            className={`mt-2 font-display text-6xl font-black ${scoreClass}`}
          >
            {displayScore === null
              ? "—"
              : displayScore}
          </strong>

          {!failed && (
            <span className="mt-1 text-xs text-slate-400">
              out of 100
            </span>
          )}
        </div>

        {/* Summary */}
        <div className="flex flex-col justify-center">
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Assessment
          </p>

          <h3 className="mt-2 font-display text-2xl font-bold">
            {failed
              ? "The scan could not be completed."
              : stopped
                ? "The scan was stopped by the safety guard."
                : `${displayLevel} risk detected`}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {report?.summary ||
              report?.aiAnalysis?.summary ||
              scan?.error ||
              (allFindings.length
                ? `${allFindings.length} suspicious signal${
                    allFindings.length === 1
                      ? ""
                      : "s"
                  } detected.`
                : "No suspicious signals were reported.")}
          </p>
        </div>
      </div>

      {/* Findings */}
      {allFindings.length > 0 && (
        <div className="border-t border-slate-100 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Findings
              </p>

              <h3 className="mt-1 font-display text-xl font-bold">
                Suspicious Signals
              </h3>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {allFindings.length}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {allFindings.map(
              (finding, index) => {
                const findingScore =
                  typeof finding?.score ===
                  "number"
                    ? finding.score
                    : null;

                const title =
                  finding?.title ||
                  finding?.name ||
                  finding?.type ||
                  "Suspicious activity";

                const explanation =
                  finding?.explanation ||
                  finding?.description ||
                  finding?.message ||
                  finding?.evidence ||
                  "Suspicious signal detected.";

                return (
                  <article
                    key={
                      finding?._id ||
                      finding?.id ||
                      `${title}-${index}`
                    }
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-slate-800">
                          {title}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {explanation}
                        </p>
                      </div>

                      {findingScore !== null && (
                        <span className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-xs font-extrabold text-slate-700">
                          +{findingScore}
                        </span>
                      )}
                    </div>

                    {finding?.severity && (
                      <span className="mt-3 inline-block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        {finding.severity}
                      </span>
                    )}
                  </article>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Scan metadata */}
      <div className="grid gap-4 border-t border-slate-100 p-6 sm:grid-cols-3 sm:p-8">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Status
          </p>

          <p className="mt-1 text-sm font-bold text-slate-700">
            {scan?.status || "—"}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Scan ID
          </p>

          <p className="mt-1 truncate text-sm font-bold text-slate-700">
            {scan?.scanId || "—"}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Completed
          </p>

          <p className="mt-1 text-sm font-bold text-slate-700">
            {scan?.completedAt
              ? new Date(
                  scan.completedAt
                ).toLocaleString()
              : "—"}
          </p>
        </div>
      </div>

      {/* Full report */}
      {scan?.scanId && (
        <div className="border-t border-slate-100 bg-slate-50 p-5">
          <Link
            to={`/report/${encodeURIComponent(
              scan.scanId
            )}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#078e42] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#06783a]"
          >
            View Full Report
            <ArrowRight size={17} />
          </Link>
        </div>
      )}
    </section>
  );
}