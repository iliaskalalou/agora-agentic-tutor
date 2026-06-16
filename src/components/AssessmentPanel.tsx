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
  const diag = AGENT_META.diagnostician;
  const question = session.pendingQuestions?.[0] ?? null;
  const evaln = session.lastEvaluation;
  const awaiting = session.status === "awaiting_input" && !!question;
  const [text, setText] = useState("");

  return (
    <div className="panel panel-pad">
      <div className="mb-3 flex items-center gap-2">
        <span className="label">Exercise</span>
        {awaiting && <span className="chip ml-auto bg-assessor/10 text-assessor !py-0.5 text-[10px]">your turn</span>}
      </div>

      {question ? (
        <div className="animate-slide-in">
          <p className="text-sm font-semibold text-slate-800">{question.prompt}</p>

          {question.type === "mcq" && question.choices && (
            <div className="mt-3 grid gap-2">
              {question.choices.map((choice, i) => (
                <button
                  key={i}
                  disabled={!awaiting || submitting}
                  onClick={() => onAnswer(question.id, i)}
                  className={cx(
                    "rounded-lg border px-3 py-2.5 text-left text-sm transition",
                    awaiting
                      ? "border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50"
                      : "border-slate-200 bg-slate-50 text-slate-400",
                  )}
                >
                  <span className="mr-2 font-mono text-xs text-slate-400">{String.fromCharCode(65 + i)}</span>
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
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <button className="btn-primary !px-4" disabled={submitting || !text.trim()} onClick={() => onAnswer(question.id, text)}>
                Send
              </button>
            </div>
          )}

          {!awaiting && session.mode === "autopilot" && (
            <div className="mt-3 text-xs text-slate-400">The demo learner is answering…</div>
          )}
        </div>
      ) : (
        <div className="grid h-24 place-items-center text-sm text-slate-400">No exercise right now.</div>
      )}

      {evaln && (
        <div
          className={cx(
            "mt-4 rounded-lg border p-3 animate-slide-in",
            evaln.correct ? "border-tutor/40 bg-tutor/5" : "border-diagnostician/40 bg-diagnostician/5",
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span style={{ color: evaln.correct ? AGENT_META.tutor.hex : diag.hex }}>
              {evaln.correct ? "✓ Correct" : "✕ Let's review this"}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-slate-700">{evaln.feedback}</p>
          {evaln.misconception && (
            <p className="mt-2 text-xs text-diagnostician">
              <span className="font-semibold">Common mistake:</span> {evaln.misconception}
            </p>
          )}
          {evaln.prerequisiteGap && (
            <p className="mt-1 text-xs text-slate-500">
              <span className="font-semibold">To revisit:</span> {evaln.prerequisiteGap}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
