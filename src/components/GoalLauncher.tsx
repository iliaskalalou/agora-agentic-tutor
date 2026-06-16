import { useState } from "react";
import type { AggregateStats, CreateSessionRequest, GoalPreset, SessionMode } from "../../shared/types";
import type { RuntimeInfo } from "../api";
import { cx } from "../util";

const ACCENTS = ["#4f46e5", "#059669", "#d97706", "#0284c7", "#7c3aed", "#e11d48"];

export default function GoalLauncher({
  presets,
  info,
  stats,
  starting,
  onStart,
}: {
  presets: GoalPreset[];
  info: RuntimeInfo | null;
  stats: AggregateStats | null;
  starting: boolean;
  onStart: (req: CreateSessionRequest) => void;
}) {
  const [goal, setGoal] = useState("");
  const [mode, setMode] = useState<SessionMode>("interactive");
  const [skill, setSkill] = useState(0.7);

  const launch = (g: string) => {
    const value = g.trim();
    if (!value || starting) return;
    onStart({ goal: value, mode, simulatedSkill: skill });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <div className="mb-9 text-center">
        <span className="chip mx-auto mb-4 border border-slate-200 bg-white text-slate-500 shadow-card">
          <span className="h-1.5 w-1.5 rounded-full bg-tutor" />
          Adaptive tutoring across subjects
        </span>
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Practice any subject.
          <br className="hidden sm:block" />
          Get instant, <span className="text-brand-600">personalized correction.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-slate-500">
          Choose a subject and work through exercises. Agora explains, checks your answers, pinpoints
          the exact gap when you miss one, and tracks your progress — adapting the path as you go.
        </p>
      </div>

      {/* Subjects */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {presets.map((p: GoalPreset, i) => (
          <button
            key={p.id}
            disabled={starting}
            onClick={() => launch(p.goal)}
            className="panel panel-pad group text-left transition hover:shadow-lift hover:border-brand-200 disabled:opacity-50"
            style={{ borderTopColor: ACCENTS[i % ACCENTS.length], borderTopWidth: 3 }}
          >
            <div className="font-semibold text-slate-900">{p.title}</div>
            <div className="mt-1 text-xs text-slate-500">{p.blurb}</div>
            <div className="mt-3 text-xs font-semibold text-brand-600 opacity-0 transition group-hover:opacity-100">
              Start →
            </div>
          </button>
        ))}
      </div>

      {/* Custom goal + controls */}
      <div className="panel panel-pad mt-5">
        <label className="label">Or type any subject</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && launch(goal)}
            placeholder="e.g. Understand the water cycle"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <button className="btn-primary sm:w-44" disabled={starting || !goal.trim()} onClick={() => launch(goal)}>
            {starting ? "Starting…" : "Start learning"}
          </button>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <div className="label mb-2">Mode</div>
            <div className="grid grid-cols-2 gap-2">
              {(["interactive", "autopilot"] as SessionMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cx(
                    "rounded-lg border px-3 py-2.5 text-left text-sm transition",
                    mode === m ? "border-brand-400 bg-brand-50" : "border-slate-200 bg-white hover:bg-slate-50",
                  )}
                >
                  <div className="font-semibold text-slate-800">{m === "interactive" ? "Practice" : "Auto demo"}</div>
                  <div className="text-[11px] text-slate-500">
                    {m === "interactive" ? "You solve the exercises" : "Watch the AI run it hands-free"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={cx(mode === "interactive" && "pointer-events-none opacity-40")}>
            <div className="label mb-2 flex items-center justify-between">
              <span>Demo learner level</span>
              <span className="text-brand-600">{Math.round(skill * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.4}
              max={0.95}
              step={0.05}
              value={skill}
              onChange={(e) => setSkill(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="mt-1 text-[11px] text-slate-400">
              Only for the auto demo — lower levels trigger more remediation.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 text-center text-xs text-slate-400">
        {stats
          ? `${stats.sessionsStarted} sessions · ${stats.conceptsMastered} concepts mastered · ${stats.remediationsInjected} adaptive remediations`
          : info
            ? "Ready"
            : "Loading…"}
      </div>
    </div>
  );
}
