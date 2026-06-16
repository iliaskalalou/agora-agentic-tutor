import pino from "pino";
import { config } from "./config";

// Pretty logs are nice locally; structured JSON is what Scalingo log drains want.
export const logger = pino({
  level: config.env === "test" ? "silent" : config.isProd ? "info" : "debug",
  base: { service: "agora" },
  transport: config.isProd
    ? undefined
    : {
        target: "pino/file",
        options: { destination: 1 },
      },
});
