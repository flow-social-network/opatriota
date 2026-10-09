import { app } from "./app.js";
import { assertRuntimeConfig, env } from "./config/env.js";
import { prisma } from "./db/prisma.js";

assertRuntimeConfig();

const server = app.listen(env.port, "0.0.0.0", () => {
  console.log(JSON.stringify({ level: "info", event: "api_started", port: env.port, environment: env.nodeEnv }));
});

let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(JSON.stringify({ level: "info", event: "shutdown_started", signal }));
  const forceExit = setTimeout(() => process.exit(1), 10_000);
  forceExit.unref();
  server.close(async (error) => {
    await prisma.$disconnect();
    clearTimeout(forceExit);
    process.exit(error ? 1 : 0);
  });
}
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
