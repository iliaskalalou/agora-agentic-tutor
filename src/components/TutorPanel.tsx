import type { Lesson } from "../../shared/types";
import { AGENT_META } from "../agents";
import { cx } from "../util";

export default function TutorPanel({ lesson }: { lesson: Lesson | null }) {
  const tutor = AGENT_META.tutor;
  return (
    <div className="panel panel-pad">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-base" style={{ color: tutor.hex }}>
          {tutor.glyph}
        </span>
        <span className="label">Tutor — current lesson</span>
        {lesson && (
          <span
            className="chip ml-auto !py-0.5 text-[10px] capitalize"
            style={{ color: tutor.hex, background: `${tutor.hex}1a` }}
          >
            {lesson.level}
          </span>
        )}
      </div>

      {!lesson ? (
        <div className="grid h-40 place-items-center text-sm text-white/30">Waiting for the first lesson…</div>
      ) : (
        <div className="animate-slide-in">
          <h3 className="text-lg font-bold leading-tight">{lesson.title}</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/75">{lesson.body}</p>

          {lesson.keyPoints.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {lesson.keyPoints.map((k, i) => (
                <li key={i} className="flex gap-2 text-sm text-white/70">
                  <span style={{ color: tutor.hex }}>▹</span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          )}

          {lesson.analogy && (
            <div
              className={cx("mt-3 rounded-xl border-l-2 bg-white/[0.03] px-3 py-2 text-sm italic text-white/60")}
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
