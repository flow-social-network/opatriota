import "dotenv/config";
import { disconnectCore, runCycle } from "./core.js";
const interval=Math.max(1000,Math.min(300000,Number(process.env.CORE_POLL_INTERVAL_MS||15000)));
let stopping=false;
async function shutdown(signal:string):Promise<void>{if(stopping)return;stopping=true;console.log(JSON.stringify({level:"info",event:"operational_core_stopping",signal}));await disconnectCore();process.exit(0);}
process.on("SIGTERM",()=>void shutdown("SIGTERM"));
process.on("SIGINT",()=>void shutdown("SIGINT"));
console.log(JSON.stringify({level:"info",event:"operational_core_started",intervalMs:interval}));
while(!stopping){
  try{const result=await runCycle();console.log(JSON.stringify({level:"info",event:"operational_core_cycle",...result,at:new Date().toISOString()}));}
  catch(error){console.error(JSON.stringify({level:"error",event:"operational_core_cycle_failed",error:error instanceof Error?error.message:"unknown"}));}
  await new Promise(resolve=>setTimeout(resolve,interval));
}
