import { useRef, useState } from "react";
import type { DocumentReview as Review } from "../../shared/types";
import { api } from "../api";

export default function DocumentReview({ sessionId }: { sessionId: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setReview(null);
    setFileName(file.name);
    setLoading(true);
    try {
      const { review: r } = await api.uploadDocument(sessionId, file);
      setReview(r);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel panel-pad">
      <div className="mb-1 flex items-center gap-2">
        <span className="label">Correct my work</span>
      </div>
      <p className="text-xs text-slate-500">
        Upload a photo of your handwritten or printed work. Agora reads it and gives you targeted
        feedback on the concept you're studying.
      </p>

      <div className="mt-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
        <button
          className="btn-ghost w-full border-dashed"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          {loading ? "Reading your work…" : fileName ? `Replace (${fileName})` : "Upload a photo (JPG / PNG)"}
        </button>
      </div>

      {loading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand-600" />
          Running OCR and reviewing…
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-diagnostician/40 bg-diagnostician/5 px-3 py-2 text-xs text-diagnostician">
          {error}
        </div>
      )}

      {review && (
        <div className="mt-3 animate-slide-in space-y-3">
          <p className="text-sm font-semibold text-slate-800">{review.verdict}</p>

          {review.strengths.length > 0 && (
            <div>
              <div className="label !text-tutor mb-1">What's working</div>
              <ul className="space-y-1">
                {review.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="text-tutor">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.corrections.length > 0 && (
            <div>
              <div className="label !text-diagnostician mb-1">To improve</div>
              <ul className="space-y-1">
                {review.corrections.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="text-diagnostician">→</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.ocrOk && review.extractedText && (
            <div>
              <button
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                onClick={() => setShowText((v) => !v)}
              >
                {showText ? "Hide" : "Show"} what we read
              </button>
              {showText && (
                <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 scroll-thin">
                  {review.extractedText}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
