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
  const shownEvents = events.filter((event) => event.type !== "snapshot");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [events]);

  return (
    <div className="panel panel-pad">
      <div className="mb-3 flex items-center justify-between">
        <span className="label">Agent activity</span>
        <span className="chip bg-slate-100 text-[10px] text-slate-500">{shownEvents.length}</span>
      </div>

      <div className="scroll-thin max-h-[60vh] space-y-2 overflow-y-auto pr-1">
        {shownEvents.map((event) => {
          const meta = AGENT_META[event.agent];
          const highlighted = event.type === "remediation" || event.type === "run.complete";

          return (
            <div
              key={event.id}
              className={cx(
                "animate-slide-in flex items-start gap-3 rounded-lg border px-3 py-2.5 transition",
                highlighted ? "border-slate-300" : "border-slate-100",
              )}
              style={{ background: highlighted ? `${meta.hex}0d` : "white" }}
            >
              <div
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[11px] font-bold"
                style={{ color: meta.hex, background: `${meta.hex}14`, border: `1px solid ${meta.hex}33` }}
              >
                {meta.glyph}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                  <span className="text-xs font-semibold" style={{ color: meta.hex }}>
                    {meta.name}
                  </span>
                  <span className="min-w-0 text-sm font-medium leading-snug text-slate-800">{event.title}</span>
                </div>
                {event.detail && (
                  <div className="mt-1 text-xs leading-relaxed text-slate-500" style={detailClampStyle}>
                    {event.detail}
                  </div>
                )}
              </div>

              <div className="shrink-0 pt-0.5 text-[11px] font-medium text-slate-300">{ago(event.ts)}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
