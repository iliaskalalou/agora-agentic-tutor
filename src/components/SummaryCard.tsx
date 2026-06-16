import type { SessionSummary } from "../../shared/types";

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center">
      <div className="text-2xl font-extrabold">{value}</div>
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
    <div className="panel panel-pad animate-slide-in border-tutor/30 bg-gradient-to-br from-tutor/10 to-transparent">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎓</span>
        <span className="label !text-tutor">Goal achieved autonomously</span>
      </div>
      <h2 className="mt-2 text-xl font-bold">{summary.goal}</h2>
      <p className="mt-1 text-sm text-white/65">{summary.headline}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat value={`${summary.conceptsMastered}/${summary.conceptsTotal}`} label="concepts" />
        <Stat value={`${Math.round(summary.masteryAvg * 100)}%`} label="avg mastery" />
        <Stat value={summary.remediationsInjected} label="auto-remediations" />
        <Stat value={`${(summary.durationMs / 1000).toFixed(1)}s`} label="run time" />
      </div>

      <button className="btn-primary mt-4 w-full" onClick={onRestart}>
        Run another goal
      </button>
    </div>
  );
}
