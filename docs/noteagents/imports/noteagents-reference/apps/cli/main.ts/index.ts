import { program } from "commander";
import { initialize } from "./commands/init.js";
import { doctor } from "./commands/doctor.js";
import { status } from "./commands/status.js";
import { audit } from "./commands/audit.js";
import { analyze } from "./commands/analyze.js";
import { readiness } from "./commands/readiness.js";
import { listAgents } from "./commands/agents/list.js";

program
  .name("noteagents")
  .description("Autonomous Engineering Agent Runtime")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize the runtime and analyze project")
  .option("-p, --project <path>", "Project root path", process.cwd())
  .action(async (options) => {
    await initialize(options.project);
  });

program
  .command("doctor")
  .description("Audit the environment")
  .option("-p, --project <path>", "Project root path", process.cwd())
  .action(async (options) => {
    await doctor(options.project);
  });

program
  .command("status")
  .description("Show project status")
  .option("-p, --project <path>", "Project root path", process.cwd())
  .action(async (options) => {
    await status(options.project);
  });

program
  .command("audit")
  .description("Run project audit")
  .option("-p, --project <path>", "Project root path", process.cwd())
  .action(async (options) => {
    await audit(options.project);
  });

program
  .command("analyze")
  .description("Analyze project structure")
  .option("-p, --project <path>", "Project root path", process.cwd())
  .action(async (options) => {
    await analyze(options.project);
  });

program
  .command("readiness")
  .description("Check project readiness")
  .option("-p, --project <path>", "Project root path", process.cwd())
  .action(async (_options) => {
    await readiness(_options.project);
  });

// Agent commands
program
  .command("agents")
  .description("Manage agents")
  .option("-p, --project <path>", "Project root path", process.cwd());

program
  .command("agents list")
  .description("List registered agents")
  .option("-p, --project <path>", "Project root path", process.cwd())
  .action(async () => {
    const agents = await listAgents();
    console.log("Registered agents:");
    agents.forEach((name) => console.log(`  - ${name}`));
  });

program.parseAsync(process.argv);