import { useState } from "react";
import type { AvatarConfig, Cursus, CurriculumTree, GoalPreset, SessionMode } from "../../shared/types";
import { cx } from "../util";
import LevelingTab from "./LevelingTab";
import { levelFromXp, ACCESSORY_UNLOCKS } from "../utils/leveling";

type Tab = "matieres" | "niveaux";

export default function SubjectBrowser({
  curriculum,
  cursus,
  presets,
  starting,
  profileName,
  xp = 0,
  avatar,
  onStartCategory,
  onStartGoal,
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
  const [tab, setTab] = useState<Tab>("matieres");
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [goal, setGoal] = useState("");
  const [mode, setMode] = useState<SessionMode>("interactive");

  const subjects = curriculum?.[cursus] ?? [];
  const subject = subjects.find((s) => s.id === subjectId) ?? null;
  const level = levelFromXp(xp);
  const nextUnlock = ACCESSORY_UNLOCKS.find((u) => u.level === level + 1);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {profileName ? `Salut ${profileName} !` : "Au programme"}
          {tab === "matieres" ? " Choisis une matière." : " Tes niveaux & récompenses."}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
          {tab === "matieres"
            ? `Sélectionne une matière puis un chapitre : l'IA génère un entraînement adapté à ton niveau (${cursus === "college" ? "collège" : "lycée"}) et à tes centres d'intérêt.`
            : nextUnlock
            ? `Niveau ${level} · Encore quelques sessions pour débloquer "${nextUnlock.label}" ${nextUnlock.emoji}`
            : `Niveau ${level} · Tu as atteint le niveau maximum !`}
        </p>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        {(["matieres", "niveaux"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cx(
              "flex-1 rounded-lg py-2 text-sm font-semibold transition",
              tab === t
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            {t === "matieres" ? "📖 Matières" : "🏆 Niveaux"}
          </button>
        ))}
      </div>

      {tab === "niveaux" ? (
        <LevelingTab xp={xp} avatar={avatar} />
      ) : (
        <>

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
              <div className="mt-1 text-xs text-slate-500">{s.categories.length} chapitres</div>
            </button>
          ))}
          {subjects.length === 0 && (
            <div className="col-span-full text-center text-sm text-slate-400">Chargement du programme…</div>
          )}
        </div>
      ) : (
        <div className="panel panel-pad">
          <div className="mb-4 flex items-center gap-3">
            <button onClick={() => setSubjectId(null)} className="btn-ghost !px-3 !py-1.5 text-xs">
              ← Matières
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
            L'IA prépare l'entraînement à la volée — cela peut prendre quelques secondes.
          </p>
        </div>
      )}

      {/* Quick start */}
      <div className="panel panel-pad mt-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="label">Entraînement rapide</div>
          <button
            onClick={() => setMode((m) => (m === "interactive" ? "autopilot" : "interactive"))}
            className={cx(
              "chip border text-[11px] transition",
              mode === "autopilot"
                ? "border-brand-200 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
            )}
            title="L'IA répond seule pour montrer le fonctionnement autonome"
          >
            <span className={cx("h-1.5 w-1.5 rounded-full", mode === "autopilot" ? "bg-brand-600" : "bg-slate-300")} />
            {mode === "autopilot" ? "Démo auto activée" : "Démo auto"}
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
            placeholder="…ou tape un objectif libre"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <button
            className="btn-primary sm:w-40"
            disabled={starting || !goal.trim()}
            onClick={() => onStartGoal(goal.trim(), mode)}
          >
            {starting ? "Préparation…" : "C'est parti"}
          </button>
        </div>
      </div>
    </>
  )}
    </div>
  );
}
