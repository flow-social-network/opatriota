import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./db/prisma.js";
const server=app.listen(env.port,"0.0.0.0",()=>console.log(JSON.stringify({level:"info",message:"api_started",port:env.port,environment:env.nodeEnv})));
async function shutdown(signal:string){console.log(JSON.stringify({level:"info",message:"shutdown_started",signal}));server.close(async()=>{await prisma.$disconnect();process.exit(0);});setTimeout(()=>process.exit(1),10000).unref();}
process.on("SIGTERM",()=>void shutdown("SIGTERM"));process.on("SIGINT",()=>void shutdown("SIGINT"));
