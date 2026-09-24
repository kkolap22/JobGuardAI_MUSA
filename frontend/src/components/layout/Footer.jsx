export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="font-display text-sm font-extrabold">
            JobGuard<span className="text-[#08ad50]"> AI</span>
          </p>

          <p className="mt-1 text-xs text-slate-500">
            AI-powered job scam investigation and risk analysis.
          </p>
        </div>

        <div className="flex items-center gap-5 text-xs font-semibold text-slate-500">
          <span>© {new Date().getFullYear()} JobGuard AI</span>

          <span className="hidden h-4 w-px bg-slate-200 sm:block" />

          <span>Built for safer job searching</span>
        </div>
      </div>
    </footer>
  );
}