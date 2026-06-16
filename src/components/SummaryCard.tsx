import type { SessionSummary } from "../../shared/types";

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-center">
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className="label mt-1 !text-[10px]">{label}</div>
    </div>
  );
}

export default function SummaryCard({
  summary,
  onRestart,
}: {
  summary: SessionSummary;
  onRestart: () => void;
}) {
  return (
    <div className="panel panel-pad animate-slide-in border-tutor/30 bg-tutor/5">
      <div className="flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="11" fill="#059669" />
          <path d="M7 12.5l3.2 3.2L17 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="label !text-tutor">Goal reached</span>
      </div>
      <h2 className="mt-2 text-xl font-bold text-slate-900">{summary.goal}</h2>
      <p className="mt-1 text-sm text-slate-600">{summary.headline}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat value={`${summary.conceptsMastered}/${summary.conceptsTotal}`} label="concepts" />
        <Stat value={`${Math.round(summary.masteryAvg * 100)}%`} label="avg mastery" />
        <Stat value={summary.remediationsInjected} label="reviews added" />
        <Stat value={`${(summary.durationMs / 1000).toFixed(1)}s`} label="time" />
      </div>

      <button className="btn-primary mt-4 w-full" onClick={onRestart}>
        Start another subject
      </button>
    </div>
  );
}
