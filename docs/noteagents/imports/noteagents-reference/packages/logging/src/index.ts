import pino from 'pino';
import pinoPretty from 'pino-pretty';

// Logger configuration following Evidence-first philosophy
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: true,
      colorize: true,
      ignore: 'node_modules',
    },
  },
  format: pino.pretty(),
});

// Create a child logger with context
export const createLogger = (service: string, logPath?: string) => {
  const base = logger.child({ service });

  if (logPath) {
    // Could add file transport here
    base.info(`Logger initialized for ${service}, logging to ${logPath}`);
  }

  return {
    info: (message: string, context?: Record<string, unknown>) => {
      base.info(message, context);
    },
    warn: (message: string, context?: Record<string, unknown>) => {
      base.warn(message, context);
    },
    error: (message: string, context?: Record<string, unknown>) => {
      base.error(message, context);
    },
    debug: (message: string, context?: Record<string, unknown>) => {
      base.debug(message, context);
    },
    trace: (message: string, context?: Record<string, unknown>) => {
      base.trace(message, context);
    },
  };
};

// Structured log types for Evidence Engine
export interface LogEntry {
  timestamp: number;
  level: "info" | "warn" | "error" | "debug";
  service: string;
  event: string;
  project_id?: string;
  task_id?: string;
  agent_id?: string;
  evidence_id?: string;
  metadata?: Record<string, unknown>;
}

// Export logger factory and types
export { logger };
export type { LogEntry };
