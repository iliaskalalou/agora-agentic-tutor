import type { Lesson } from "../../shared/types";
import { AGENT_META } from "../agents";

export default function TutorPanel({ lesson }: { lesson: Lesson | null }) {
  const tutor = AGENT_META.tutor;
  return (
    <div className="panel panel-pad">
      <div className="mb-3 flex items-center gap-2">
        <span className="label">Lesson</span>
        {lesson && (
          <span
            className="chip ml-auto !py-0.5 text-[10px] capitalize"
            style={{ color: tutor.hex, background: `${tutor.hex}14` }}
          >
            {lesson.level}
          </span>
        )}
      </div>

      {!lesson ? (
        <div className="grid h-40 place-items-center text-sm text-slate-400">Preparing your first lesson…</div>
      ) : (
        <div className="animate-slide-in">
          <h3 className="text-lg font-bold leading-tight text-slate-900">{lesson.title}</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{lesson.body}</p>

          {lesson.keyPoints.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {lesson.keyPoints.map((k, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span style={{ color: tutor.hex }}>▹</span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          )}

          {lesson.analogy && (
            <div
              className="mt-3 rounded-lg border-l-2 bg-slate-50 px-3 py-2 text-sm italic text-slate-600"
              style={{ borderColor: tutor.hex }}
            >
              {lesson.analogy}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
