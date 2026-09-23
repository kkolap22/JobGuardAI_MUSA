import { CheckCircle2, CircleAlert, ShieldCheck, TriangleAlert } from "lucide-react";

export default function Result({ scan, report, findings = [], risk, score, level }) {
  const all = findings.length ? findings : report?.findings || [];
  const failed = scan.status === "FAILED";
  return (
    <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
      <div className="flex items-start justify-between gap-4"><div><span className="text-[11px] font-extrabold tracking-[.14em] text-[#08ad50]">SCAN RESULT</span><h2 className="mt-2 font-display text-2xl font-bold">Job Safety Report</h2><p className="mt-1 break-all text-xs text-slate-500">{scan.jobUrl}</p></div><div className={`grid h-12 w-12 place-items-center rounded-xl ${failed || risk === "danger" ? "bg-red-50 text-red-600" : risk === "warn" ? "bg-amber-50 text-amber-600" : "bg-[#eafff1] text-[#08ad50]"}`}>{failed || risk === "danger" ? <TriangleAlert /> : <ShieldCheck />}</div></div>
      <div className="mt-7 flex items-center gap-6 rounded-2xl bg-[#f4fff8] p-6"><strong className="font-display text-6xl text-[#08ad50]">{failed ? "—" : score}</strong><div><b className="text-sm">{failed ? "SCAN FAILED" : `${level} RISK`}</b><p className="mt-1 text-sm text-slate-500">{failed ? scan.error || "The scanner could not complete this job check." : report?.summary || "Analysis complete."}</p></div></div>
      <div className="mt-8"><h3 className="font-display text-xl font-bold">Findings &amp; Detected Signals</h3>{all.length ? all.map((finding, index) => <div key={index} className="flex gap-3 border-b border-slate-100 py-4 text-sm"><CircleAlert className="shrink-0 text-amber-500" size={18} /><span><b>{(finding.type || "Finding").replaceAll("_", " ")}: </b>{finding.evidence || finding.explanation || finding.description || "Signal detected"}</span></div>) : <div className="mt-4 flex items-center gap-2 text-sm text-[#07843e]"><CheckCircle2 size={18} />No high-risk scam signals detected.</div>}</div>
    </article>
  );
}