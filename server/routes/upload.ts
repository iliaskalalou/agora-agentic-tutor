import { Router } from "express";
import multer from "multer";
import { loadSession, keys } from "../store/sessionStore";
import { getStore } from "../redis";
import { ocrImage } from "../services/ocr";
import { reviewDocument } from "../agents/reviewer";
import { emitEvent } from "../events";
import type { Blueprint } from "../agents/types";

export const uploadRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB
});

// Upload a photo of the learner's work; OCR it and have the Reviewer agent
// correct it against the concept currently being studied.
uploadRouter.post("/:id/document", upload.single("file"), async (req, res) => {
  const session = await loadSession(req.params.id);
  if (!session) return res.status(404).json({ error: "session not found" });
  if (!req.file) return res.status(400).json({ error: "no file uploaded" });
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(415).json({ error: "please upload an image (JPG or PNG)" });
  }

  const { text, ok } = await ocrImage(req.file.buffer);

  const blueprint = await getStore().getJSON<Blueprint>(keys.blueprint(req.params.id));
  const kb = blueprint?.concepts.find((c) => c.key === session.currentConceptId);

  const review = await reviewDocument(text, ok, kb?.title, kb?.keyPoints ?? []);

  await emitEvent({
    sessionId: req.params.id,
    agent: "diagnostician",
    type: "evaluation",
    title: "Reviewed your uploaded work",
    detail: review.verdict,
    data: { review },
  });

  res.json({ review });
});
