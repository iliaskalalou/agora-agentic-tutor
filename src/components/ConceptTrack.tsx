import type { Concept, SessionState } from "../../shared/types";
import { cx } from "../util";

const STATUS_STYLE: Record<Concept["status"], { ring: string; dot: string; label: string }> = {
  pending: { ring: "border-slate-200", dot: "bg-slate-300", label: "up next" },
  teaching: { ring: "border-tutor/40", dot: "bg-tutor", label: "learning" },
  assessing: { ring: "border-assessor/40", dot: "bg-assessor", label: "exercise" },
  remediating: { ring: "border-diagnostician/40", dot: "bg-diagnostician", label: "reviewing" },
  mastered: { ring: "border-tutor/40", dot: "bg-tutor", label: "done" },
};

export default function ConceptTrack({ session }: { session: SessionState }) {
  const concepts = session.plan?.concepts ?? [];
  const mastered = concepts.filter((c) => c.status === "mastered").length;
  const pct = concepts.length ? Math.round((mastered / concepts.length) * 100) : 0;

  return (
    <div className="panel panel-pad">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="label">Your path</span>
          <span className="text-xs text-slate-500">{session.plan?.goal}</span>
        </div>
        <span className="text-xs font-semibold text-slate-600">
          {mastered}/{concepts.length} done
        </span>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-tutor transition-all duration-500"
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
                "min-w-[150px] shrink-0 rounded-lg border bg-white p-3 transition",
                s.ring,
                active && "ring-2 ring-brand-300",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-300">{String(i + 1).padStart(2, "0")}</span>
                {c.injected ? (
                  <span className="chip bg-diagnostician/10 text-diagnostician !px-1.5 !py-0.5 text-[9px]">
                    added for you
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-wide text-slate-400">{c.difficulty}</span>
                )}
              </div>
              <div className="mt-1 text-sm font-semibold leading-tight text-slate-800">{c.title}</div>
              <div className="mt-2 flex items-center gap-1.5">
                <span className={cx("h-1.5 w-1.5 rounded-full", s.dot, active && "animate-pulse-soft")} />
                <span className="text-[10px] text-slate-500">{c.status === "mastered" ? "✓ done" : s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
