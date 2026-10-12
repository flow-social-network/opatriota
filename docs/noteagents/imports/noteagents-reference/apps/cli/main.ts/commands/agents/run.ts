export async function runAgent(
  agentName: string,
  task: string,
  _apply: boolean = false,
  _noCache: boolean = false
): Promise<{ status: string; changes: string[]; tests: string[]; remainingErrors: string[] }> {
  // Read the agent definition
  const fs = require("fs");
  const path = require("path");
  const agentPath = path.join(__dirname, "..", "..", "agents", `${agentName}.json`);
  
  try {
    const content = fs.readFileSync(agentPath, "utf-8");
    JSON.parse(content); // Validate agent exists
  } catch {
    return {
      status: "FAILED",
      changes: [],
      tests: [],
      remainingErrors: [`Agent "${agentName}" not found`],
    };
  }
  
  // Simple LLM call using fetch
  const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
  const apiKey = process.env.NVIDIA_API_KEY || "";
  const model = process.env.NOTEAGENTS_MODEL || "";
  
  if (!apiKey) {
    return {
      status: "FAILED",
      changes: [],
      tests: [],
      remainingErrors: ["NVIDIA_API_KEY not set"],
    };
  }
  
  if (!model) {
    return {
      status: "FAILED",
      changes: [],
      tests: [],
      remainingErrors: ["NOTEAGENTS_MODEL not set"],
    };
  }
  
  const completionRequest = {
    messages: [
      { role: "system", content: `You are ${agentName}, an autonomous agent.` },
      { role: "user", content: task },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  };
  
  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(completionRequest),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        status: "FAILED",
        changes: [],
        tests: [],
        remainingErrors: [`LLM error ${response.status}: ${errorText}`],
      };
    }
    
    const data = (await response.json()) as { choices: Array<{ delta: any }> };
    const firstChoice = data.choices[0];
    const responseText = firstChoice ? firstChoice.delta?.content || "" : "";
    
    // Try to parse as JSON output contract
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      return {
        status: "FAILED",
        changes: [responseText],
        tests: [],
        remainingErrors: ["Invalid JSON response from LLM"],
      };
    }
    
    return {
      status: parsed.status || "FAILED",
      changes: parsed.changes || [],
      tests: parsed.tests || [],
      remainingErrors: parsed.remaining_errors || [],
    };
  } catch (error: any) {
    return {
      status: "FAILED",
      changes: [],
      tests: [],
      remainingErrors: [error.message || "Unknown error"],
    };
  }
}