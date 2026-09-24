import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CircleAlert,
  LoaderCircle,
  Search,
} from "lucide-react";

import Layout from "../components/layout/Layout";
import Tag from "../components/common/Tag";
import { scanApi } from "../services/scan.api";

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await scanApi.getAll();

      setScans(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      setError(
        err.message || "Unable to load scan history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getRiskClass = (level) => {
    switch (String(level || "").toUpperCase()) {
      case "CRITICAL":
        return "bg-red-100 text-red-700";

      case "HIGH":
        return "bg-orange-100 text-orange-700";

      case "MEDIUM":
        return "bg-amber-100 text-amber-700";

      case "LOW":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusClass = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "STOPPED":
        return "bg-amber-100 text-amber-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "RUNNING":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="text-center">
          <Tag>SCAN HISTORY</Tag>

          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Your Job Scans
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Review your previous JobGuard investigations
            and open their full reports.
          </p>
        </div>

        {loading && (
          <div className="mt-12 flex items-center justify-center gap-3 text-slate-500">
            <LoaderCircle
              size={22}
              className="animate-spin"
            />
            Loading scan history...
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <div className="flex items-center gap-3">
              <CircleAlert size={20} />
              <strong>Unable to load history</strong>
            </div>

            <p className="mt-2 text-sm">
              {error}
            </p>

            <button
              type="button"
              onClick={loadHistory}
              className="mt-4 font-bold underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          scans.length === 0 && (
            <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eafff1] text-[#08ad50]">
                <Search />
              </div>

              <h2 className="mt-5 font-display text-2xl font-bold">
                No scans yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Start your first job investigation to
                see it here.
              </p>

              <Link
                to="/scan"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#078e42] px-5 py-3 text-sm font-bold text-white"
              >
                Scan a Job
                <ArrowRight size={18} />
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          scans.length > 0 && (
            <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <div className="hidden grid-cols-[1fr_120px_120px_100px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400 md:grid">
                <span>Job</span>
                <span>Risk</span>
                <span>Status</span>
                <span></span>
              </div>

              <div className="divide-y divide-slate-100">
                {scans.map((scan, index) => {
                  const scanId =
                    scan.scanId ||
                    scan._id ||
                    scan.id;

                  const riskLevel =
                    scan.riskLevel ||
                    scan.risk_level ||
                    "—";

                  const riskScore =
                    scan.riskScore ??
                    scan.risk_score ??
                    "—";

                  return (
                    <div
                      key={scanId || index}
                      className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_120px_120px_100px] md:items-center"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">
                          {scan.jobUrl ||
                            scan.job_url ||
                            "Unknown job"}
                        </p>

                        {scan.startedAt && (
                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(
                              scan.startedAt
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${getRiskClass(
                            riskLevel
                          )}`}
                        >
                          {riskLevel}
                        </span>

                        <p className="mt-1 text-xs text-slate-400">
                          Score: {riskScore}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            scan.status
                          )}`}
                        >
                          {scan.status || "—"}
                        </span>
                      </div>

                      <div>
                        {scanId ? (
                          <Link
                            to={`/report/${scanId}`}
                            className="inline-flex items-center gap-1 text-sm font-bold text-[#078e42] hover:underline"
                          >
                            Report
                            <ArrowRight size={16} />
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </section>
    </Layout>
  );
}