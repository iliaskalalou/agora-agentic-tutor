import type { Concept, SessionState } from "../../shared/types";
import { cx } from "../util";

const STATUS_STYLE: Record<Concept["status"], { ring: string; dot: string; label: string }> = {
  pending: { ring: "border-white/10", dot: "bg-white/25", label: "queued" },
  teaching: { ring: "border-tutor/50", dot: "bg-tutor", label: "teaching" },
  assessing: { ring: "border-assessor/50", dot: "bg-assessor", label: "assessing" },
  remediating: { ring: "border-diagnostician/50", dot: "bg-diagnostician", label: "remediating" },
  mastered: { ring: "border-tutor/40", dot: "bg-tutor", label: "mastered" },
};

export default function ConceptTrack({ session }: { session: SessionState }) {
  const concepts = session.plan?.concepts ?? [];
  const mastered = concepts.filter((c) => c.status === "mastered").length;
  const pct = concepts.length ? Math.round((mastered / concepts.length) * 100) : 0;

  return (
    <div className="panel panel-pad">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="label">Learning plan</span>
          <span className="text-xs text-white/40">{session.plan?.goal}</span>
        </div>
        <span className="text-xs font-semibold text-white/60">
          {mastered}/{concepts.length} mastered
        </span>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-planner to-tutor transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scroll-thin">
        {concepts.map((c, i) => {
          const s = STATUS_STYLE[c.status];
          const active = c.id === session.currentConceptId;
          return (
            <div
              key={c.id}
              className={cx(
                "min-w-[150px] shrink-0 rounded-xl border bg-ink-900/50 p-3 transition",
                s.ring,
                active && "ring-2 ring-planner/60",
                c.status === "mastered" && "opacity-90",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {c.injected ? (
                  <span className="chip bg-diagnostician/20 text-diagnostician !px-1.5 !py-0.5 text-[9px]">
                    auto-added
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-wide text-white/30">{c.difficulty}</span>
                )}
              </div>
              <div className="mt-1 text-sm font-semibold leading-tight">{c.title}</div>
              <div className="mt-2 flex items-center gap-1.5">
                <span className={cx("h-1.5 w-1.5 rounded-full", s.dot, active && "animate-pulse-soft")} />
                <span className="text-[10px] text-white/45">
                  {c.status === "mastered" ? "✓ mastered" : s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
