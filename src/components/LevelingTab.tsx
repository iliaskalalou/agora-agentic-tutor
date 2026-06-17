import Avatar, { randomAvatar } from "./Avatar";
import { levelFromXp, levelProgress, xpForLevel, xpToNextLevel, ACCESSORY_UNLOCKS, MAX_LEVEL } from "../utils/leveling";
import { cx } from "../util";
import type { AvatarConfig } from "../../shared/types";

const BASE_AVATAR: AvatarConfig = randomAvatar();

export default function LevelingTab({ xp, avatar }: { xp: number; avatar?: AvatarConfig }) {
  const level = levelFromXp(xp);
  const progress = levelProgress(xp);
  const toNext = xpToNextLevel(xp);
  const isMax = level >= MAX_LEVEL;
  const base = avatar ?? BASE_AVATAR;
  const nextUnlock = ACCESSORY_UNLOCKS.find((u) => u.level === level + 1);
  const message = isMax
    ? "You've reached the top — keep your knowledge sharp!"
    : nextUnlock
      ? `Keep up your effort! ${toNext} XP to unlock "${nextUnlock.label}".`
      : "Keep up your effort — you're doing great!";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Current avatar with an encouraging speech bubble */}
      <div className="panel panel-pad flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
        <Avatar config={base} size={150} />
        <div className="relative w-full sm:flex-1">
          <div className="rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4 text-center text-sm font-semibold text-brand-700 sm:text-left">
            {message}
          </div>
          {/* speech-bubble tail (points up on mobile, left on desktop) */}
          <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-brand-200 bg-brand-50 sm:left-0 sm:top-1/2" />
        </div>
      </div>

      {/* XP / Level card */}
      <div className="panel panel-pad">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-3xl font-extrabold text-brand-700 ring-2 ring-brand-200">
            {level}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-slate-900">
                {level === 0
                  ? "Beginner"
                  : (ACCESSORY_UNLOCKS.find((u) => u.level === level)?.label ?? `Level ${level}`)}
              </span>
              <span className="text-xs text-slate-400">
                {xp} XP{!isMax && ` · ${toNext} XP to go`}
              </span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
              <span>Lv. {level}</span>
              {!isMax && <span>Lv. {level + 1} — {xpForLevel(level + 1)} XP</span>}
              {isMax && <span>Max level reached</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Accessories grid */}
      <div>
        <h2 className="label mb-3">Accessories to unlock</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {ACCESSORY_UNLOCKS.map((unlock) => {
            const unlocked = level >= unlock.level;
            const previewConfig: AvatarConfig = {
              ...base,
              accessory: unlocked ? unlock.accessoryId : "none",
            };
            return (
              <div
                key={unlock.level}
                className={cx(
                  "panel flex flex-col items-center gap-2 py-4 px-2 text-center transition",
                  unlocked ? "bg-white" : "bg-slate-50",
                )}
              >
                <div className={cx("relative", !unlocked && "opacity-30 grayscale")}>
                  <Avatar config={previewConfig} size={64} />
                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-sm font-bold text-slate-500">
                        ?
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <div className={cx("text-xs font-semibold", unlocked ? "text-slate-900" : "text-slate-400")}>
                    {unlocked ? `${unlock.emoji} ${unlock.label}` : `Lv. ${unlock.level}`}
                  </div>
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    {unlocked ? unlock.description : `${xpForLevel(unlock.level) - xp} XP to go`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
