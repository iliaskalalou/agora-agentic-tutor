import type { SessionState } from "../../shared/types";
import MasteryDial from "./MasteryDial";

function Tile({ value, label, tone }: { value: string | number; label: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 text-center">
      <div className={`text-xl font-extrabold ${tone ?? "text-white"}`}>{value}</div>
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
        <span className="label">Live telemetry</span>
        <span className="text-[11px] text-white/40">step {session.stepCount}</span>
      </div>

      <div className="flex justify-center py-1">
        <MasteryDial value={session.masteryAvg} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Tile value={m.lessonsDelivered} label="lessons" tone="text-tutor" />
        <Tile value={m.questionsAsked} label="checks" tone="text-assessor" />
        <Tile value={`${accuracy}%`} label="accuracy" tone="text-learner" />
        <Tile value={m.remediationsInjected} label="remediations" tone="text-diagnostician" />
        <Tile value={m.conceptsMastered} label="mastered" tone="text-tutor" />
        <Tile value={session.llmProvider === "simulation" ? "sim" : m.llmCalls} label="llm calls" tone="text-planner" />
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs">
        <span className="text-white/45">Learner</span>
        <span className="font-semibold text-white/80">{session.learner.name}</span>
      </div>
    </div>
  );
}
