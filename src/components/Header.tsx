import type { SessionState } from "../../shared/types";
import type { RuntimeInfo } from "../api";
import { cx } from "../util";
import Logo from "./Logo";

export default function Header({
  info,
  session,
  advanced,
  onToggleAdvanced,
  onRestart,
}: {
  info: RuntimeInfo | null;
  session?: SessionState | null;
  advanced: boolean;
  onToggleAdvanced: () => void;
  onRestart?: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
      <Logo />

      <div className="flex flex-wrap items-center gap-2">
        {advanced && info && (
          <>
            <span className="chip border border-slate-200 bg-slate-50 text-slate-500">
              <span className="label !text-[10px]">LLM</span>
              <span className={info.llmLive ? "text-tutor" : "text-slate-600"}>
                {info.llmLive ? info.provider : "simulation"}
              </span>
            </span>
            <span className="chip border border-slate-200 bg-slate-50 text-slate-500">
              <span className="label !text-[10px]">store</span>
              <span className="text-slate-600">{info.storeBackend}</span>
            </span>
          </>
        )}

        {session && (
          <button
            onClick={onToggleAdvanced}
            className={cx(
              "chip border transition",
              advanced
                ? "border-brand-200 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
            )}
            title="Show the AI agents working behind the scenes"
          >
            <span className={cx("h-2 w-2 rounded-full", advanced ? "bg-brand-600" : "bg-slate-300")} />
            Coach view
          </button>
        )}

        {session && onRestart && (
          <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={onRestart}>
            New session
          </button>
        )}
      </div>
    </header>
  );
}
