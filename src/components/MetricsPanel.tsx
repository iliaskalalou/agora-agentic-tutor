import type { SessionState } from "../../shared/types";
import MasteryDial from "./MasteryDial";

function Tile({ value, label, tone }: { value: string | number; label: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-center">
      <div className={`text-xl font-extrabold ${tone ?? "text-slate-900"}`}>{value}</div>
      <div className="label mt-0.5 !text-[9px]">{label}</div>
    </div>
  );
}

export default function MetricsPanel({ session }: { session: SessionState }) {
  const m = session.metrics;
  const accuracy = m.questionsAsked > 0 ? Math.round((m.correctAnswers / m.questionsAsked) * 100) : 0;

  return (
    <div className="panel panel-pad">
      <div className="mb-3 flex items-center justify-between">
        <span className="label">Progress</span>
        <span className="text-[11px] text-slate-400">{session.learner.name}</span>
      </div>

      <div className="flex justify-center py-1">
        <MasteryDial value={session.masteryAvg} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Tile value={m.questionsAsked} label="exercises" tone="text-assessor" />
        <Tile value={`${accuracy}%`} label="accuracy" tone="text-brand-600" />
      </div>
    </div>
  );
}
