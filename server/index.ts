import { existsSync } from "node:fs";
import path from "node:path";
import express, { type Express } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import pinoHttp from "pino-http";
import { config } from "./config";
import { logger } from "./logger";
import { initStore, getStore } from "./redis";
import { healthRouter } from "./routes/health";
import { metaRouter } from "./routes/meta";
import { sessionsRouter } from "./routes/sessions";
import { uploadRouter } from "./routes/upload";
import { eventsRouter } from "./routes/events";
import { rateLimit } from "./middleware/rateLimit";

// Build the Express app and initialize the store. Exported so tests can drive it
// with supertest without binding a port.
export async function createApp(): Promise<Express> {
  await initStore();

  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1); // Scalingo runs behind a proxy; needed for real client IPs
  // CSP disabled to keep the PoC's inline styling and web-font loading simple.
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
  app.use(compression());
  // The front-end is same-origin in production, so CORS is only needed for the
  // Vite dev server. Disable cross-origin sharing in production.
  app.use(cors({ origin: config.isProd ? false : true }));
  app.use(express.json({ limit: "128kb" }));
  app.use(
    pinoHttp({
      logger,
      autoLogging: { ignore: (req) => (req.url ?? "").startsWith("/events") },
    }),
  );

  app.use("/api", healthRouter);
  app.use("/api", metaRouter);
  // Rate-limit the write paths that spawn autonomous compute or OCR.
  app.use("/api/sessions", rateLimit({ windowMs: 60_000, max: 40 }), sessionsRouter);
  app.use("/api/sessions", uploadRouter);
  app.use("/events", eventsRouter);

  // Serve the built front-end in production. In dev, Vite serves it on :5173.
  const publicDir = path.resolve(process.cwd(), "dist/public");
  if (existsSync(publicDir)) {
    app.use(express.static(publicDir, { maxAge: "1h", index: false }));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.startsWith("/events")) return next();
      res.sendFile(path.join(publicDir, "index.html"));
    });
  } else {
    app.get("/", (_req, res) => {
      res.json({
        service: "agora",
        note: "Front-end not built. Run `npm run build` for production, or `npm run dev` for the dev server on :5173.",
        api: ["/api/health", "/api/info", "/api/presets", "/api/sessions"],
      });
    });
  }

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error({ err: err.message }, "unhandled request error");
    res.status(500).json({ error: "internal server error" });
  });

  return app;
}

async function start(): Promise<void> {
  const app = await createApp();
  const server = app.listen(config.port, () => {
    logger.info(
      { port: config.port, env: config.env, store: getStore().backend, llm: config.llm.provider },
      "Agora server listening",
    );
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "shutting down");
    server.close(() => logger.info("http server closed"));
    await getStore().close();
    setTimeout(() => process.exit(0), 500);
  };
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

// Auto-start unless we are under test (where the app is driven via createApp()).
if (config.env !== "test") {
  start().catch((err) => {
    logger.error({ err: (err as Error).message }, "fatal boot error");
    process.exit(1);
  });
}
