import { useState } from "react";
import type { SessionState } from "../../shared/types";
import { AGENT_META } from "../agents";
import { cx } from "../util";

export default function AssessmentPanel({
  session,
  submitting,
  onAnswer,
}: {
  session: SessionState;
  submitting: boolean;
  onAnswer: (questionId: string, answer: number | string) => void;
}) {
  const assessor = AGENT_META.assessor;
  const diag = AGENT_META.diagnostician;
  const question = session.pendingQuestions?.[0] ?? null;
  const evaln = session.lastEvaluation;
  const awaiting = session.status === "awaiting_input" && !!question;
  const [text, setText] = useState("");

  return (
    <div className="panel panel-pad">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-base" style={{ color: assessor.hex }}>
          {assessor.glyph}
        </span>
        <span className="label">Assessment</span>
      </div>

      {question ? (
        <div className="animate-slide-in">
          <p className="text-sm font-semibold text-white/85">{question.prompt}</p>

          {question.type === "mcq" && question.choices && (
            <div className="mt-3 grid gap-2">
              {question.choices.map((choice, i) => (
                <button
                  key={i}
                  disabled={!awaiting || submitting}
                  onClick={() => onAnswer(question.id, i)}
                  className={cx(
                    "rounded-xl border px-3 py-2.5 text-left text-sm transition",
                    awaiting
                      ? "border-white/10 bg-white/5 hover:border-assessor/60 hover:bg-assessor/10"
                      : "border-white/5 bg-white/[0.02] text-white/55",
                  )}
                >
                  <span className="mr-2 font-mono text-xs text-white/40">{String.fromCharCode(65 + i)}</span>
                  {choice}
                </button>
              ))}
            </div>
          )}

          {question.type === "open" && awaiting && (
            <div className="mt-3 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && text.trim() && onAnswer(question.id, text)}
                placeholder="Type your answer…"
                className="flex-1 rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2 text-sm outline-none focus:border-assessor/60"
              />
              <button
                className="btn-primary !px-4"
                disabled={submitting || !text.trim()}
                onClick={() => onAnswer(question.id, text)}
              >
                Send
              </button>
            </div>
          )}

          {!awaiting && session.mode === "autopilot" && (
            <div className="mt-3 text-xs text-white/40">The Learner agent is answering autonomously…</div>
          )}
        </div>
      ) : (
        <div className="grid h-24 place-items-center text-sm text-white/30">No active check.</div>
      )}

      {/* Latest diagnosis */}
      {evaln && (
        <div
          className={cx(
            "mt-4 rounded-xl border p-3 animate-slide-in",
            evaln.correct ? "border-tutor/40 bg-tutor/10" : "border-diagnostician/40 bg-diagnostician/10",
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span style={{ color: evaln.correct ? AGENT_META.tutor.hex : diag.hex }}>
              {evaln.correct ? "✓ Correct" : "✕ Needs work"}
            </span>
            <span className="text-white/40">·</span>
            <span className="text-white/60">{diag.name}</span>
          </div>
          <p className="mt-1.5 text-sm text-white/75">{evaln.feedback}</p>
          {evaln.misconception && (
            <p className="mt-2 text-xs text-diagnostician/90">
              <span className="font-semibold">Misconception:</span> {evaln.misconception}
            </p>
          )}
          {evaln.prerequisiteGap && (
            <p className="mt-1 text-xs text-white/50">
              <span className="font-semibold">Gap to close:</span> {evaln.prerequisiteGap}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
