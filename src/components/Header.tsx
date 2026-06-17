import type { SessionState } from "../../shared/types";
import type { RuntimeInfo } from "../api";
import { cx } from "../util";
import Logo from "./Logo";
import Avatar from "./Avatar";
import type { Profile } from "./ProfileSetup";

function GearIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default function Header({
  info,
  session,
  profile,
  advanced,
  onToggleAdvanced,
  onEditProfile,
  onGoHome,
}: {
  info: RuntimeInfo | null;
  session?: SessionState | null;
  profile?: Profile | null;
  advanced: boolean;
  onToggleAdvanced: () => void;
  onEditProfile?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <Logo />
        {profile && (
          <>
            {/* Click the profile to return to the subject menu. */}
            <button
              onClick={onGoHome}
              className="ml-1 flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 transition hover:bg-slate-50"
              title="Back to subjects"
            >
              <Avatar config={profile.avatar} size={28} />
              <span className="text-sm font-semibold text-slate-700">{profile.name}</span>
            </button>
            {/* Settings gear opens profile editing. */}
            <button
              onClick={onEditProfile}
              className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              title="Profile settings"
              aria-label="Profile settings"
            >
              <GearIcon />
            </button>
          </>
        )}
      </div>

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
              <span className="label !text-[10px]">storage</span>
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
            title="See the AI agents working behind the scenes"
          >
            <span className={cx("h-2 w-2 rounded-full", advanced ? "bg-brand-600" : "bg-slate-300")} />
            Coach view
          </button>
        )}
      </div>
    </header>
  );
}
