import type { SessionState } from "../../shared/types";
import type { RuntimeInfo } from "../api";
import { cx } from "../util";

function Badge({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <span className="chip border border-white/10 bg-white/5">
      <span className="label !text-[10px]">{label}</span>
      <span className={cx("font-semibold", tone)}>{value}</span>
    </span>
  );
}

export default function Header({
  info,
  session,
  onRestart,
}: {
  info: RuntimeInfo | null;
  session?: SessionState | null;
  onRestart?: () => void;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-planner to-orchestrator text-lg shadow-glow">
          🏛️
        </div>
        <div>
          <div className="text-lg font-extrabold leading-none tracking-tight">
            Agora
          </div>
          <div className="text-[11px] text-white/45">The self-driving classroom</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {info && (
          <>
            <Badge
              label="LLM"
              value={info.llmLive ? info.provider : "simulation"}
              tone={info.llmLive ? "text-tutor" : "text-white/70"}
            />
            <Badge
              label="store"
              value={info.storeBackend}
              tone={info.storeBackend === "redis" ? "text-diagnostician" : "text-white/70"}
            />
          </>
        )}
        {session && (
          <span className="chip border border-white/10 bg-white/5">
            <span className={cx("h-2 w-2 rounded-full", session.mode === "autopilot" ? "bg-learner" : "bg-assessor")} />
            <span className="font-semibold capitalize">{session.mode}</span>
          </span>
        )}
        {session && onRestart && (
          <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={onRestart}>
            ↺ New run
          </button>
        )}
      </div>
    </header>
  );
}
