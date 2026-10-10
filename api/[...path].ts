import { app } from "../backend/src/app";

/**
 * Vercel catch-all for /api/* — routes every API path through the Express
 * app (auth, articles, admin, push, notifications, operational core).
 * More specific functions (api/news.ts, api/fact-check.ts) take precedence.
 */
export default app;
