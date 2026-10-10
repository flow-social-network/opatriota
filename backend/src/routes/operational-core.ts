import { Router } from "express";
import { OperationalTaskStatus, UserRole } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { asyncHandler, HttpError } from "../lib/http.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router=Router();
router.use(requireAuth,requireRole(UserRole.ADMIN,UserRole.CHIEF_EDITOR));

router.get("/status",asyncHandler(async(_req,res)=>{
  const [pending,running,failed,succeeded,activeRssSources,recentTasks,recentRuns]=await Promise.all([
    prisma.operationalTask.count({where:{status:OperationalTaskStatus.PENDING}}),
    prisma.operationalTask.count({where:{status:OperationalTaskStatus.RUNNING}}),
    prisma.operationalTask.count({where:{status:OperationalTaskStatus.FAILED}}),
    prisma.operationalTask.count({where:{status:OperationalTaskStatus.SUCCEEDED}}),
    prisma.source.count({where:{status:"ACTIVE",kind:"RSS"}}),
    prisma.operationalTask.findMany({orderBy:{createdAt:"desc"},take:20,select:{id:true,taskType:true,status:true,attempts:true,createdAt:true,finishedAt:true,lastError:true}}),
    prisma.agentExecution.findMany({orderBy:{createdAt:"desc"},take:20,select:{id:true,taskId:true,agent:true,status:true,startedAt:true,finishedAt:true,error:true}})
  ]);
  res.json({data:{status:"api_available_worker_must_be_verified_separately",activeRssSources,tasks:{pending,running,failed,succeeded,recent:recentTasks},agentRuns:recentRuns}});
}));

router.get("/tasks",asyncHandler(async(req,res)=>{
  const take=Math.max(1,Math.min(100,Number.parseInt(String(req.query.limit??"50"),10)||50));
  const status=typeof req.query.status==="string"&&Object.values(OperationalTaskStatus).includes(req.query.status as OperationalTaskStatus)?req.query.status as OperationalTaskStatus:undefined;
  const tasks=await prisma.operationalTask.findMany({where:status?{status}:undefined,orderBy:{createdAt:"desc"},take});
  res.json({data:tasks});
}));

router.post("/tasks/:id/retry",asyncHandler(async(req,res)=>{
  const task=await prisma.operationalTask.findUnique({where:{id:req.params.id}});
  if(!task) throw new HttpError(404,"TASK_NOT_FOUND","Tarefa não encontrada.");
  if(task.status!=="FAILED") throw new HttpError(409,"TASK_NOT_FAILED","Só tarefas falhadas podem ser reencaminhadas.");
  const updated=await prisma.operationalTask.update({where:{id:task.id},data:{status:OperationalTaskStatus.PENDING,attempts:0,availableAt:new Date(),startedAt:null,finishedAt:null,lastError:null}});
  res.json({data:updated});
}));
export default router;
