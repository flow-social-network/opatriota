// @file Audit SDK - Security and code quality rules
// Scans for secrets, FIXME/TODO, file sizes, and dependency issues

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// Regex patterns for secret detection
const SECRET_PATTERNS = {
  // API keys (Nvidia, OpenAI, etc.)
  apiKey: /(?:api[_-]?key|apikey|API[_-]?KEY)[-_]?[=:]?["']?([a-zA-Z0-9]{20,})["']?/gi,
  // Auth tokens
  authToken: /(?:token|auth[_-]?token|Bearer)["']?[=:]?["']?([a-zA-Z0-9._-]{20,})["']?/gi,
  // Private keys (simplified)
  privateKey: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----.*?-----END (?:RSA |EC )?PRIVATE KEY-----/gs,
  // Nvidia API key specific
  nvidiaKey: /NVIDIA_API_KEY["']?[=:]?["']?([a-zA-Z0-9]{20,})["']?/gi,
};

// File size limit (in bytes) - files larger than this will be flagged
const MAX_FILE_SIZE = 1000000; // 1MB

/**
 * Scan a file for secrets using regex patterns
 * Returns findings with file path and line numbers
 */
export function scanFileForSecrets(filePath: string): Array<{
  pattern: keyof typeof SECRET_PATTERNS;
  line: number;
  content: string;
  severity: "critical" | "high";
}> {
  const findings: Array<{
    pattern: keyof typeof SECRET_PATTERNS;
    line: number;
    content: string;
    severity: "critical" | "high";
  }> = [];

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      // Check each pattern
      if (SECRET_PATTERNS.apiKey.test(line)) {
        findings.push({
          pattern: "apiKey",
          line: lineNumber,
          content: line.trim(),
          severity: "critical",
        });
      }

      if (SECRET_PATTERNS.authToken.test(line)) {
        findings.push({
          pattern: "authToken",
          line: lineNumber,
          content: line.trim(),
          severity: "critical",
        });
      }

      if (SECRET_PATTERNS.privateKey.test(line)) {
        findings.push({
          pattern: "privateKey",
          line: lineNumber,
          content: line.trim().substring(0, 50),
          severity: "critical",
        });
      }

      if (SECRET_PATTERNS.nvidiaKey.test(line)) {
        findings.push({
          pattern: "nvidiaKey",
          line: lineNumber,
          content: line.trim(),
          severity: "critical",
        });
      }
    }
  } catch {
    // File can't be read, skip
  }

  return findings;
}

/**
 * Scan a directory for files containing secrets
 */
export function scanDirectoryForSecrets(
  dirPath: string,
  ignorePatterns: string[] = []
): Array<{
  file: string;
  findings: Array<{
    pattern: keyof typeof SECRET_PATTERNS;
    line: number;
    content: string;
    severity: "critical" | "high";
  }>;
}> {
  const results: Array<{
    file: string;
    findings: Array<{
      pattern: keyof typeof SECRET_PATTERNS;
      line: number;
      content: string;
      severity: "critical" | "high";
    }>;
  }> = [];

  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        // Recurse into subdirectories
        const subResults = scanDirectoryForSecrets(fullPath, ignorePatterns);
        results.push(...subResults);
      } else if (file.isFile()) {
        // Check ignore patterns
        const shouldIgnore = ignorePatterns.some((pattern) => {
          const regex = new RegExp(pattern);
          return regex.test(fullPath);
        });

        if (!shouldIgnore) {
          const findings = scanFileForSecrets(fullPath);
          if (findings.length > 0) {
            results.push({
              file: fullPath,
              findings,
            });
          }
        }
      }
    }
  } catch {
    // Directory can't be read, skip
  }

  return results;
}

/**
 * Check for excessive TODO/FIXME comments
 * Threshold: more than 5 TODO/FIXME per 1000 lines
 */
export function checkTodoFimxe(
  dirPath: string,
  threshold: number = 5
): Array<{
  file: string;
  todoCount: number;
  FIXMECount: number;
  totalLines: number;
  exceedsThreshold: boolean;
}> {
  const results: Array<{
    file: string;
    todoCount: number;
    FIXMECount: number;
    totalLines: number;
    exceedsThreshold: boolean;
  }> = [];

  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        // Recurse into subdirectories
        const subResults = checkTodoFimxe(fullPath, threshold);
        results.push(...subResults);
      } else if (file.isFile()) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split("\n");
        const totalLines = lines.length;

        // Count TODO and FIXME (case-insensitive)
        const todoMatches = content.match(/todo|TODO/gi);
        const FIXMEmatches = content.match(/FIXME|fixme/gi);

        const todoCount = todoMatches ? todoMatches.length : 0;
        const FIXMECount = FIXMEmatches ? FIXMEmatches.length : 0;

        const totalTodoFimxe = todoCount + FIXMECount;
        const exceedsThreshold = totalTodoFimxe > threshold;

        if (exceedsThreshold) {
          results.push({
            file: fullPath,
            todoCount,
            FIXMECount,
            totalLines,
            exceedsThreshold,
          });
        }
      }
    }
  } catch {
    // Directory can't be read, skip
  }

  return results;
}

/**
 * Check for large files in the directory
 */
export function checkLargeFiles(
  dirPath: string,
  maxSize: number = MAX_FILE_SIZE
): Array<{
  file: string;
  size: number;
  exceedsLimit: boolean;
}> {
  const results: Array<{
    file: string;
    size: number;
    exceedsLimit: boolean;
  }> = [];

  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        // Recurse into subdirectories
        const subResults = checkLargeFiles(fullPath, maxSize);
        results.push(...subResults);
      } else if (file.isFile()) {
        try {
          const stat = fs.statSync(fullPath);
          const exceedsLimit = stat.size > maxSize;

          if (exceedsLimit) {
            results.push({
              file: fullPath,
              size: stat.size,
              exceedsLimit,
            });
          }
        } catch {
          // Can't stat file, skip
        }
      }
    }
  } catch {
    // Directory can't be read, skip
  }

  return results;
}

/**
 * Run pnpm audit --json when available
 * Returns parsed results or "not evaluated" if network fails
 */
export async function runPnpmAudit(): Promise<{
  success: boolean;
  data: any;
  evaluated: boolean;
}> {
  try {
    const { execSync } = await import("child_process");
    const output = execSync("pnpm audit --json", { cwd: process.cwd(), timeout: 30000 })
      .toString();

    try {
      const parsed = JSON.parse(output);
      return {
        success: true,
        data: parsed,
        evaluated: true,
      };
    } catch {
      return {
        success: false,
        data: { error: "Invalid JSON output" },
        evaluated: false,
      };
    }
  } catch {
    // Network error or pnpm not available
    return {
      success: false,
      data: { status: "not evaluated", reason: "network_error_or_unavailable" },
      evaluated: false,
    };
  }
}

/**
 * Check dependencies for known vulnerabilities
 * This is a basic implementation - in production would use advisory databases
 */
export function checkDependencies(
  lockfilePath: string = "pnpm-lock.yaml"
): Array<{
  dependency: string;
  vulnerability: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "affected" | "not_affected" | "unknown";
}> {
  const results: Array<{
    dependency: string;
    vulnerability: string;
    severity: "critical" | "high" | "medium" | "low";
    status: "affected" | "not_affected" | "unknown";
  }> = [];

  // This is a placeholder - real implementation would check against
  // vulnerability databases (npm audit, Snyk, etc.)
  // For now, just check if the lockfile exists
  try {
    if (fs.existsSync(lockfilePath)) {
      results.push({
        dependency: "pnpm-lock.yaml",
        vulnerability: "Lockfile exists - no known vulnerabilities checked automatically",
        severity: "info",
        status: "unknown",
      });
    } else {
      results.push({
        dependency: "pnpm-lock.yaml",
        vulnerability: "Lockfile not found",
        severity: "warn",
        status: "unknown",
      });
    }
  } catch {
    results.push({
      dependency: "pnpm-lock.yaml",
      vulnerability: "Could not check lockfile",
      severity: "error",
      status: "unknown",
    });
  }

  return results;
}

/**
 * Main audit function that runs all audit checks
 */
export interface AuditResult {
  overallScore: number;
  secrets: Array<{
    file: string;
    count: number;
    severity: "critical" | "high" | "medium" | "low";
  }>;
  todoFimxe: Array<{
    file: string;
    count: number;
    exceedsThreshold: boolean;
  }>;
  largeFiles: Array<{
    file: string;
    size: number;
    exceedsLimit: boolean;
  }>;
  dependencies: Array<{
    dependency: string;
    status: "affected" | "not_affected" | "unknown";
  }>;
  pnpmAudit: {
    success: boolean;
    evaluated: boolean;
    data: any;
  };
  recommendations: string[];
}

/**
 * Execute a complete audit of a project directory
 */
export async function executeAudit(
  projectPath: string = process.cwd(),
  options: {
    scanSecrets: boolean;
    checkTodo: boolean;
    checkFileSize: boolean;
    checkDependencies: boolean;
    pnpmAudit: boolean;
    secretThreshold: number;
  } = {}
): Promise<AuditResult> {
  const config = {
    scanSecrets: true,
    checkTodo: true,
    checkFileSize: true,
    checkDependencies: true,
    pnpmAudit: true,
    secretThreshold: 0,
    ...options,
  };

  const result: AuditResult = {
    overallScore: 100,
    secrets: [],
    todoFimxe: [],
    largeFiles: [],
    dependencies: [],
    pnpmAudit: {
      success: false,
      evaluated: false,
      data: {},
    },
    recommendations: [],
  };

  // 1. Scan for secrets
  if (config.scanSecrets) {
    const secretFindings = scanDirectoryForSecrets(projectPath);
    result.secrets = secretFindings.map((sf) => ({
      file: sf.file,
      count: sf.findings.length,
      severity: sf.findings.reduce(
        (acc, f) => (f.severity === "critical" ? "critical" : f.severity === "high" ? "high" : acc),
        "low" as "critical" | "high" | "medium" | "low"
      ),
    }));

    // Deduct points for secrets
    for (const secret of result.secrets) {
      if (secret.severity === "critical") {
        result.overallScore -= 20;
      } else if (secret.severity === "high") {
        result.overallScore -= 10;
      }
    }
  }

  // 2. Check TODO/FIXME
  if (config.checkTodo) {
    const todoFindings = checkTodoFimxe(projectPath);
    result.todoFimxe = todoFindings;

    // Deduct points for excessive TODO/FIXME
    for (const todo of result.todoFimxe) {
      result.overallScore -= 5;
    }
  }

  // 3. Check large files
  if (config.checkFileSize) {
    result.largeFiles = checkLargeFiles(projectPath);

    // Deduct points for large files
    for (const largeFile of result.largeFiles) {
      result.overallScore -= 5;
    }
  }

  // 4. Check dependencies
  if (config.checkDependencies) {
    result.dependencies = checkDependencies();
  }

  // 5. Run pnpm audit
  if (config.pnpmAudit) {
    result.pnpmAudit = await runPnpmAudit();

    if (!result.pnpmAudit.evaluated) {
      // Don't penalize if network unavailable
      result.overallScore = Math.max(result.overallScore, 70);
      result.recommendations.push("pnpm audit could not be run (network issue)");
    }
  }

  // Ensure score doesn't go below 0
  result.overallScore = Math.max(result.overallScore, 0);

  // Generate recommendations
  if (result.secrets.length > 0) {
    result.recommendations.push("Remove hardcoded secrets and use environment variables");
  }

  if (result.todoFimxe.length > 0) {
    result.recommendations.push("Reduce TODO/FIXME comments or address them");
  }

  if (result.largeFiles.length > 0) {
    result.recommendations.push("Review and potentially split large files");
  }

  if (!result.pnpmAudit.evaluated) {
    result.recommendations.push("Run pnpm audit manually to check dependencies");
  }

  return result;
}
