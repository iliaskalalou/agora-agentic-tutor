import type { AgentKind, SessionStatus } from "../../shared/types";
import { AGENT_META, AGENT_ORDER } from "../agents";
import { cx } from "../util";

export default function AgentRoster({
  activeAgent,
  status,
}: {
  activeAgent: AgentKind | null;
  status: SessionStatus;
}) {
  const live = status === "running" || status === "awaiting_input";
  return (
    <div className="panel panel-pad">
      <div className="mb-3 flex items-center justify-between">
        <span className="label">Agent crew</span>
        <span className={cx("chip text-[10px]", live ? "bg-tutor/15 text-tutor" : "bg-white/5 text-white/40")}>
          <span className={cx("h-1.5 w-1.5 rounded-full", live ? "bg-tutor animate-pulse-soft" : "bg-white/30")} />
          {live ? "active" : status}
        </span>
      </div>
      <div className="space-y-2">
        {AGENT_ORDER.map((kind) => {
          const m = AGENT_META[kind];
          const isActive = activeAgent === kind && live;
          return (
            <div
              key={kind}
              className={cx(
                "flex items-center gap-3 rounded-xl border px-3 py-2 transition",
                isActive ? "border-white/20 bg-white/10" : "border-white/5 bg-white/[0.02]",
              )}
            >
              <div
                className={cx("grid h-8 w-8 place-items-center rounded-lg text-base", isActive && "animate-pulse-soft")}
                style={{
                  color: m.hex,
                  background: `${m.hex}1a`,
                  border: `1px solid ${m.hex}55`,
                }}
              >
                {m.glyph}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold" style={{ color: isActive ? m.hex : undefined }}>
                  {m.name}
                </div>
                <div className="truncate text-[11px] text-white/40">{m.role}</div>
              </div>
              {isActive && <span className="text-[10px] font-semibold" style={{ color: m.hex }}>●</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
