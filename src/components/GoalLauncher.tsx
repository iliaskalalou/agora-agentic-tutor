import { useState } from "react";
import type { AggregateStats, CreateSessionRequest, GoalPreset, SessionMode } from "../../shared/types";
import type { RuntimeInfo } from "../api";
import { cx } from "../util";

const SKILL_LABELS = ["Struggling", "Developing", "Steady", "Confident", "Advanced"];

function skillLabel(v: number): string {
  return SKILL_LABELS[Math.min(SKILL_LABELS.length - 1, Math.floor(v * SKILL_LABELS.length))];
}

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
  const [mode, setMode] = useState<SessionMode>("autopilot");
  const [skill, setSkill] = useState(0.7);

  const launch = (g: string) => {
    const value = g.trim();
    if (!value || starting) return;
    onStart({ goal: value, mode, simulatedSkill: skill });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <div className="chip mx-auto mb-4 border border-white/10 bg-white/5 text-white/60">
          <span className="h-2 w-2 rounded-full bg-tutor animate-pulse-soft" />
          Agentic AI in education · live PoC
        </div>
        <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
          Give a learning goal.
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-planner via-learner to-tutor bg-clip-text text-transparent">
            Watch six agents teach it autonomously.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-white/55">
          Agora plans a curriculum, teaches each concept, quizzes the learner, diagnoses mistakes and
          rewrites its own plan to fix prerequisite gaps — with little to no human intervention.
        </p>
      </div>

      {/* Preset goals */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {presets.map((p: GoalPreset) => (
          <button
            key={p.id}
            disabled={starting}
            onClick={() => launch(p.goal)}
            className="panel panel-pad group text-left transition hover:border-planner/50 hover:bg-ink-700/70 disabled:opacity-50"
          >
            <div className="text-2xl">{p.emoji}</div>
            <div className="mt-2 font-semibold">{p.title}</div>
            <div className="mt-1 text-xs text-white/45">{p.blurb}</div>
            <div className="mt-3 text-xs font-semibold text-planner opacity-0 transition group-hover:opacity-100">
              Start run →
            </div>
          </button>
        ))}
      </div>

      {/* Custom goal + controls */}
      <div className="panel panel-pad mt-5">
        <label className="label">Or type any goal</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && launch(goal)}
            placeholder="e.g. Understand the water cycle"
            className="flex-1 rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-planner/60"
          />
          <button className="btn-primary sm:w-40" disabled={starting || !goal.trim()} onClick={() => launch(goal)}>
            {starting ? "Starting…" : "Launch agents"}
          </button>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {/* Mode */}
          <div>
            <div className="label mb-2">Run mode</div>
            <div className="grid grid-cols-2 gap-2">
              {(["autopilot", "interactive"] as SessionMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cx(
                    "rounded-xl border px-3 py-2.5 text-left text-sm transition",
                    mode === m
                      ? "border-planner/60 bg-planner/15"
                      : "border-white/10 bg-white/5 hover:bg-white/10",
                  )}
                >
                  <div className="font-semibold capitalize">{m}</div>
                  <div className="text-[11px] text-white/45">
                    {m === "autopilot" ? "Simulated learner — fully hands-off" : "You answer the quizzes"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Skill (autopilot only) */}
          <div className={cx(mode === "interactive" && "pointer-events-none opacity-40")}>
            <div className="label mb-2 flex items-center justify-between">
              <span>Learner level</span>
              <span className="text-learner">{skillLabel(skill)}</span>
            </div>
            <input
              type="range"
              min={0.4}
              max={0.95}
              step={0.05}
              value={skill}
              onChange={(e) => setSkill(Number(e.target.value))}
              className="w-full accent-learner"
            />
            <div className="mt-1 text-[11px] text-white/40">
              Lower levels trip more misconceptions, so the agents remediate more often.
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-xs text-white/40">
        <span>
          LLM:{" "}
          <span className={info?.llmLive ? "text-tutor" : "text-white/70"}>
            {info ? (info.llmLive ? info.provider : "deterministic simulation") : "…"}
          </span>
        </span>
        <span>
          Store: <span className="text-white/70">{info?.storeBackend ?? "…"}</span>
        </span>
        {stats && (
          <span>
            {stats.sessionsStarted} runs · {stats.conceptsMastered} concepts mastered ·{" "}
            {stats.remediationsInjected} auto-remediations
          </span>
        )}
      </div>
    </div>
  );
}
