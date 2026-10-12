export async function listAgents(): Promise<string[]> {
  // Read agents from the local agents directory
  const fs = require("fs");
  const path = require("path");
  const agentsDir = path.join(__dirname, "..", "..", "agents");
  
  try {
    const files = fs.readdirSync(agentsDir);
    const jsonFiles = files.filter((f: string) => f.endsWith(".json"));
    const agents: string[] = [];
    
    for (const file of jsonFiles) {
      const filePath = path.join(agentsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const agent = JSON.parse(content);
      agents.push(agent.identity);
    }
    
    return agents;
  } catch {
    return [];
  }
}