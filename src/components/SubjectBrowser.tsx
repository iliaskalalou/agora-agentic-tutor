import { useState } from "react";
import type { AvatarConfig, Cursus, CurriculumTree, GoalPreset, SessionMode } from "../../shared/types";
import { cx } from "../util";
import LevelingTab from "./LevelingTab";
import { levelFromXp, ACCESSORY_UNLOCKS } from "../utils/leveling";

type Tab = "subjects" | "levels";

export default function SubjectBrowser({
  curriculum,
  cursus,
  starting,
  profileName,
  xp = 0,
  avatar,
  onStartCategory,
}: {
  curriculum: CurriculumTree | null;
  cursus: Cursus;
  presets: GoalPreset[];
  starting: boolean;
  profileName?: string;
  xp?: number;
  avatar?: AvatarConfig;
  onStartCategory: (a: {
    subjectId: string;
    categoryId: string;
    subjectName: string;
    categoryName: string;
    mode: SessionMode;
  }) => void;
  onStartGoal: (goal: string, mode: SessionMode) => void;
}) {
  const [tab, setTab] = useState<Tab>("subjects");
  const [subjectId, setSubjectId] = useState<string | null>(null);

  const subjects = curriculum?.[cursus] ?? [];
  const subject = subjects.find((s) => s.id === subjectId) ?? null;
  const level = levelFromXp(xp);
  const nextUnlock = ACCESSORY_UNLOCKS.find((u) => u.level === level + 1);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {profileName ? `Hi ${profileName}!` : "Let's learn"}
          {tab === "subjects" ? " Pick a subject." : " Your levels & rewards."}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
          {tab === "subjects"
            ? `Choose a subject, then a chapter: the AI generates practice tailored to your level (${cursus === "college" ? "middle school" : "high school"}) and your interests.`
            : nextUnlock
              ? `Level ${level} · a few more sessions to unlock "${nextUnlock.label}"`
              : `Level ${level} · you reached the max level!`}
        </p>
      </div>

      {/* Tab bar */}
      <div className="mx-auto mb-6 flex max-w-sm gap-1 rounded-xl bg-slate-100 p-1">
        {(["subjects", "levels"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cx(
              "flex-1 rounded-lg py-2 text-sm font-semibold transition",
              tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
            )}
          >
            {t === "subjects" ? "Subjects" : "Levels"}
          </button>
        ))}
      </div>

      {tab === "levels" ? (
        <LevelingTab xp={xp} avatar={avatar} />
      ) : !subject ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSubjectId(s.id)}
              className="panel panel-pad text-left transition hover:shadow-lift"
              style={{ borderTopColor: s.color, borderTopWidth: 3 }}
            >
              <div className="font-semibold text-slate-900">{s.name}</div>
              <div className="mt-1 text-xs text-slate-500">{s.categories.length} chapters</div>
            </button>
          ))}
          {subjects.length === 0 && (
            <div className="col-span-full text-center text-sm text-slate-400">Loading the curriculum…</div>
          )}
        </div>
      ) : (
        <div className="panel panel-pad">
          <div className="mb-4 flex items-center gap-3">
            <button onClick={() => setSubjectId(null)} className="btn-ghost !px-3 !py-1.5 text-xs">
              ← Subjects
            </button>
            <span className="font-bold text-slate-900" style={{ color: subject.color }}>
              {subject.name}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {subject.categories.map((c) => (
              <button
                key={c.id}
                disabled={starting}
                onClick={() =>
                  onStartCategory({
                    subjectId: subject.id,
                    categoryId: c.id,
                    subjectName: subject.name,
                    categoryName: c.name,
                    mode: "interactive",
                  })
                }
                className={cx(
                  "rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50",
                  starting && "opacity-50",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">The AI builds your practice on the fly — this may take a few seconds.</p>
        </div>
      )}
    </div>
  );
}
