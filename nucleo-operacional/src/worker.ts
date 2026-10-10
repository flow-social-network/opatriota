import "dotenv/config";
import { disconnectCore, recordHeartbeat, runCycle } from "./core.js";
const interval=Math.max(1000,Math.min(300000,Number(process.env.CORE_POLL_INTERVAL_MS||15000)));
let stopping=false;
async function shutdown(signal:string):Promise<void>{if(stopping)return;stopping=true;console.log(JSON.stringify({level:"info",event:"operational_core_stopping",signal}));await disconnectCore();process.exit(0);}
process.on("SIGTERM",()=>void shutdown("SIGTERM"));
process.on("SIGINT",()=>void shutdown("SIGINT"));
console.log(JSON.stringify({level:"info",event:"operational_core_started",intervalMs:interval}));
try { await recordHeartbeat(); } catch(error) { console.error(JSON.stringify({level:"error",event:"operational_core_heartbeat_failed",error:error instanceof Error?error.message:"unknown"})); }
while(!stopping){
  try{const result=await runCycle();await recordHeartbeat();console.log(JSON.stringify({level:"info",event:"operational_core_cycle",...result,at:new Date().toISOString()}));}
  catch(error){const message=error instanceof Error?error.message:"unknown";console.error(JSON.stringify({level:"error",event:"operational_core_cycle_failed",error:message}));try{await recordHeartbeat(message);}catch(heartbeatError){console.error(JSON.stringify({level:"error",event:"operational_core_heartbeat_failed",error:heartbeatError instanceof Error?heartbeatError.message:"unknown"}));}}
  await new Promise(resolve=>setTimeout(resolve,interval));
}
