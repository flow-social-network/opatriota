-- Núcleo operacional: fila persistente, execuções dos agentes e proveniência da imagem.
CREATE TYPE "OperationalTaskStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED');
CREATE TYPE "AgentType" AS ENUM ('EDITORIAL_WRITER', 'SYSTEM_GUARDIAN');
CREATE TYPE "AgentRunStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED');

ALTER TABLE "articles"
  ADD COLUMN "heroImageSourceUrl" TEXT,
  ADD COLUMN "heroImageCredit" TEXT;

CREATE TABLE "operational_tasks" (
  "id" TEXT NOT NULL,
  "taskType" TEXT NOT NULL,
  "status" "OperationalTaskStatus" NOT NULL DEFAULT 'PENDING',
  "payload" JSONB NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "maxAttempts" INTEGER NOT NULL DEFAULT 4,
  "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP(3),
  "finishedAt" TIMESTAMP(3),
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "operational_tasks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "agent_executions" (
  "id" TEXT NOT NULL,
  "taskId" TEXT NOT NULL,
  "agent" "AgentType" NOT NULL,
  "status" "AgentRunStatus" NOT NULL DEFAULT 'RUNNING',
  "input" JSONB NOT NULL,
  "output" JSONB,
  "error" TEXT,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agent_executions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "operational_tasks_idempotencyKey_key" ON "operational_tasks"("idempotencyKey");
CREATE INDEX "operational_tasks_status_availableAt_idx" ON "operational_tasks"("status","availableAt");
CREATE INDEX "operational_tasks_taskType_status_idx" ON "operational_tasks"("taskType","status");
CREATE INDEX "agent_executions_taskId_createdAt_idx" ON "agent_executions"("taskId","createdAt");
CREATE INDEX "agent_executions_agent_status_createdAt_idx" ON "agent_executions"("agent","status","createdAt");

ALTER TABLE "agent_executions"
  ADD CONSTRAINT "agent_executions_taskId_fkey"
  FOREIGN KEY ("taskId") REFERENCES "operational_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
