import { useState } from "react";
import type { Cursus, CurriculumTree, GoalPreset, SessionMode } from "../../shared/types";
import { cx } from "../util";

export default function SubjectBrowser({
  curriculum,
  cursus,
  presets,
  starting,
  profileName,
  onStartCategory,
  onStartGoal,
}: {
  curriculum: CurriculumTree | null;
  cursus: Cursus;
  presets: GoalPreset[];
  starting: boolean;
  profileName?: string;
  onStartCategory: (a: {
    subjectId: string;
    categoryId: string;
    subjectName: string;
    categoryName: string;
    mode: SessionMode;
  }) => void;
  onStartGoal: (goal: string, mode: SessionMode) => void;
}) {
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [goal, setGoal] = useState("");
  const [mode, setMode] = useState<SessionMode>("interactive");

  const subjects = curriculum?.[cursus] ?? [];
  const subject = subjects.find((s) => s.id === subjectId) ?? null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {profileName ? `Hi ${profileName}!` : "Let's learn"} Pick a subject.
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
          Choose a subject, then a chapter: the AI generates practice tailored to your level
          ({cursus === "college" ? "middle school" : "high school"}) and your interests.
        </p>
      </div>

      {!subject ? (
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
                    mode,
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
          <p className="mt-3 text-xs text-slate-400">
            The AI builds your practice on the fly — this may take a few seconds.
          </p>
        </div>
      )}

      {/* Quick start */}
      <div className="panel panel-pad mt-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="label">Quick practice</div>
          <button
            onClick={() => setMode((m) => (m === "interactive" ? "autopilot" : "interactive"))}
            className={cx(
              "chip border text-[11px] transition",
              mode === "autopilot"
                ? "border-brand-200 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
            )}
            title="The AI answers on its own to show how it works autonomously"
          >
            <span className={cx("h-1.5 w-1.5 rounded-full", mode === "autopilot" ? "bg-brand-600" : "bg-slate-300")} />
            {mode === "autopilot" ? "Auto demo on" : "Auto demo"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              disabled={starting}
              onClick={() => onStartGoal(p.goal, mode)}
              className="chip border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              {p.title}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goal.trim() && onStartGoal(goal.trim(), mode)}
            placeholder="…or type your own goal"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <button
            className="btn-primary sm:w-40"
            disabled={starting || !goal.trim()}
            onClick={() => onStartGoal(goal.trim(), mode)}
          >
            {starting ? "Preparing…" : "Let's go"}
          </button>
        </div>
      </div>
    </div>
  );
}
