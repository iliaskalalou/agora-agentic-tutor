import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { AgentEvent } from "../../shared/types";
import { AGENT_META } from "../agents";
import { ago, cx } from "../util";

const detailClampStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export default function ActivityStream({ events }: { events: AgentEvent[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const shownEvents = events.filter((event) => event.type !== "snapshot").sort((a, b) => a.ts - b.ts);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [events]);

  return (
    <div className="panel panel-pad">
      <div className="mb-3 flex items-center justify-between">
        <span className="label">Agent activity</span>
        <span className="chip bg-white/5 text-[10px] text-white/45">{shownEvents.length} shown</span>
      </div>

      <div className="scroll-thin max-h-[60vh] space-y-2 overflow-y-auto pr-1">
        {shownEvents.map((event) => {
          const meta = AGENT_META[event.agent];
          const highlighted = event.type === "remediation" || event.type === "run.complete";

          return (
            <div
              key={event.id}
              className={cx(
                "animate-slide-in flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.025] px-3 py-2.5 transition",
                highlighted && "ring-1 ring-white/10",
              )}
              style={{
                background: highlighted ? `${meta.hex}0f` : undefined,
              }}
            >
              <div
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-base"
                style={{
                  color: meta.hex,
                  background: `${meta.hex}1a`,
                  border: `1px solid ${meta.hex}55`,
                }}
              >
                {meta.glyph}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                  <span className="text-sm font-semibold" style={{ color: meta.hex }}>
                    {meta.name}
                  </span>
                  <span className="min-w-0 text-sm font-medium leading-snug text-white">{event.title}</span>
                </div>
                {event.detail && (
                  <div className="mt-1 text-xs leading-relaxed text-white/50" style={detailClampStyle}>
                    {event.detail}
                  </div>
                )}
              </div>

              <div className="shrink-0 pt-0.5 text-[11px] font-medium text-white/30">{ago(event.ts)}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
