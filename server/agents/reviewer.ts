import { chat, extractJson } from "./llm";
import type { DocumentReview } from "../../shared/types";

const REVIEWER_SYSTEM =
  "You are Agora's Reviewer agent. A learner uploaded a photo of their work. You are given the OCR text and the concept they are studying. Return STRICT JSON: {\"verdict\": string, \"strengths\": string[], \"corrections\": string[]}. Be specific, encouraging, and concise. No prose outside the JSON.";

// Build a useful review with no LLM: check coverage of the concept's key points,
// surface what is present, and suggest what to revisit.
function deterministicReview(
  text: string,
  conceptTitle: string | undefined,
  keyPoints: string[],
  ocrOk: boolean,
): DocumentReview {
  if (!ocrOk || text.length < 3) {
    return {
      extractedText: text,
      ocrOk,
      conceptTitle,
      verdict: "I couldn't read the document clearly.",
      strengths: [],
      corrections: [
        "Upload a sharper, well-lit photo (avoid glare and shadows).",
        "Make sure the handwriting or text fills most of the frame.",
      ],
    };
  }

  const lower = text.toLowerCase();
  const covered: string[] = [];
  const missing: string[] = [];
  for (const point of keyPoints) {
    const terms = point
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 4);
    const hit = terms.some((t) => lower.includes(t));
    (hit ? covered : missing).push(point);
  }

  const strengths = covered.slice(0, 3).map((p) => `You touched on: ${p}`);
  if (text.length > 40) strengths.unshift("Your answer is developed, not just a one-liner.");

  const corrections: string[] = [];
  for (const p of missing.slice(0, 3)) corrections.push(`Make sure to address: ${p}`);
  corrections.push("Re-read your steps and check each follows from the previous one.");

  return {
    extractedText: text,
    ocrOk,
    conceptTitle,
    verdict: conceptTitle
      ? `Here is feedback on your work for "${conceptTitle}".`
      : "Here is feedback on your uploaded work.",
    strengths: strengths.slice(0, 3),
    corrections: corrections.slice(0, 4),
  };
}

export async function reviewDocument(
  text: string,
  ocrOk: boolean,
  conceptTitle: string | undefined,
  keyPoints: string[],
): Promise<DocumentReview> {
  const fallback = deterministicReview(text, conceptTitle, keyPoints, ocrOk);
  if (!ocrOk || text.length < 3) return fallback;

  const raw = await chat(
    REVIEWER_SYSTEM,
    [
      conceptTitle ? `Concept being studied: ${conceptTitle}` : "No specific concept in focus.",
      keyPoints.length ? `Key points it should cover: ${keyPoints.join("; ")}` : "",
      "Learner's work (OCR text):",
      text.slice(0, 2000),
    ]
      .filter(Boolean)
      .join("\n"),
    600,
  );

  if (raw) {
    try {
      const parsed = extractJson<{ verdict: string; strengths: string[]; corrections: string[] }>(raw.text);
      return {
        extractedText: text,
        ocrOk,
        conceptTitle,
        verdict: parsed.verdict || fallback.verdict,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 4) : fallback.strengths,
        corrections: Array.isArray(parsed.corrections) ? parsed.corrections.slice(0, 5) : fallback.corrections,
      };
    } catch {
      /* fall through to deterministic */
    }
  }
  return fallback;
}
