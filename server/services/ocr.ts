import { createWorker, type Worker } from "tesseract.js";
import { logger } from "../logger";

// Lazily create a single Tesseract worker and reuse it across uploads. The
// worker is heavy to spin up (it loads the English model), so we keep one warm.
let workerPromise: Promise<Worker> | null = null;

async function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = createWorker("eng").catch((err) => {
      workerPromise = null; // allow a later retry
      throw err;
    });
  }
  return workerPromise;
}

// Extract text from an image buffer. Returns "" on failure so the caller can
// degrade gracefully rather than 500.
export async function ocrImage(buffer: Buffer): Promise<{ text: string; ok: boolean }> {
  try {
    const worker = await getWorker();
    const { data } = await worker.recognize(buffer);
    return { text: (data.text ?? "").trim(), ok: true };
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "OCR failed");
    return { text: "", ok: false };
  }
}
