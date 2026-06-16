import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    env: {
      NODE_ENV: "test",
      AGORA_STEP_DELAY_MS: "0",
    },
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});
