import { randomBytes } from "node:crypto";
import { Router } from "express";
import { JournalistVerificationStatus, UserRole } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { asyncHandler, HttpError, readString } from "../lib/http.js";
import { requireAuth, requireRole, type AuthUser } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth,requireRole(UserRole.ADMIN,UserRole.CHIEF_EDITOR));
const eligibleRoles: UserRole[] = [UserRole.JOURNALIST,UserRole.EDITOR,UserRole.CHIEF_EDITOR,UserRole.ADMIN];
function slugify(value:string){return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,100);}
function optionalText(value:unknown,field:string,max:number):string|null{
 if(value===undefined||value===null||value==="")return null;
 if(typeof value!=="string")throw new HttpError(400,"VALIDATION_ERROR",field+" must be a string");
 const v=value.trim();if(v.length>max)throw new HttpError(400,"VALIDATION_ERROR",field+" exceeds "+max+" characters");return v||null;
}
function optionalHttpsUrl(value:unknown,field:string):string|null{
 const text=optionalText(value,field,2048);if(!text)return null;let url:URL;
 try{url=new URL(text);}catch{throw new HttpError(400,"VALIDATION_ERROR",field+" must be a valid HTTPS URL");}
 if(url.protocol!=="https:")throw new HttpError(400,"VALIDATION_ERROR",field+" must use HTTPS");return url.toString();
}
function newCredentialCode(){return "OPB-"+randomBytes(6).toString("hex").toUpperCase();}
function actor(res:import("express").Response):AuthUser{return res.locals.user as AuthUser;}

router.get("/",asyncHandler(async(req,res)=>{
 const page=Math.max(1,Number.parseInt(String(req.query.page??"1"),10)||1);
 const pageSize=Math.max(1,Math.min(100,Number.parseInt(String(req.query.pageSize??"20"),10)||20));
 const status=typeof req.query.status==="string"&&Object.values(JournalistVerificationStatus).includes(req.query.status as JournalistVerificationStatus)?req.query.status as JournalistVerificationStatus:undefined;
 const query=typeof req.query.query==="string"?req.query.query.trim():"";
 const where={
  ...(status?{status}:{}),
  ...(query?{OR:[
   {slug:{contains:query,mode:"insensitive" as const}},
   {credentialCode:query.toUpperCase()},
   {user:{displayName:{contains:query,mode:"insensitive" as const}}},
  ]}:{}),
 };
 const [total,items]=await Promise.all([
  prisma.journalistProfile.count({where}),
  prisma.journalistProfile.findMany({where,skip:(page-1)*pageSize,take:pageSize,orderBy:{updatedAt:"desc"},select:{
   id:true,userId:true,slug:true,professionalTitle:true,credentialCode:true,status:true,verifiedAt:true,verifiedById:true,expiresAt:true,evidenceReference:true,createdAt:true,updatedAt:true,
   user:{select:{displayName:true,email:true,role:true,disabledAt:true}},verifiedBy:{select:{displayName:true,email:true}},
  }}),
 ]);
 res.json({data:items,pagination:{page,pageSize,total,pages:Math.ceil(total/pageSize)}});
}));

router.put("/:userId/profile",asyncHandler(async(req,res)=>{
 const userId=readString(req.params.userId,"userId",128);
 const target=await prisma.user.findUnique({where:{id:userId},select:{id:true,displayName:true,role:true,disabledAt:true}});
 if(!target||target.disabledAt||!eligibleRoles.includes(target.role))throw new HttpError(404,"ELIGIBLE_JOURNALIST_NOT_FOUND","An active newsroom user was not found");
 const slug=slugify(optionalText(req.body?.slug,"slug",120)??target.displayName);
 if(!slug)throw new HttpError(400,"VALIDATION_ERROR","A valid public profile slug is required");
 const collision=await prisma.journalistProfile.findFirst({where:{slug,userId:{not:userId}},select:{id:true}});
 if(collision)throw new HttpError(409,"PROFILE_SLUG_TAKEN","That public profile URL is already in use");
 const professionalTitle=optionalText(req.body?.professionalTitle,"professionalTitle",120);
 const bio=optionalText(req.body?.bio,"bio",5000);
 const photoUrl=optionalHttpsUrl(req.body?.photoUrl,"photoUrl");
 const publicContactUrl=optionalHttpsUrl(req.body?.publicContactUrl,"publicContactUrl");
 const evidenceReference=optionalText(req.body?.evidenceReference,"evidenceReference",1000);
 const current=await prisma.journalistProfile.findUnique({where:{userId}});
 const credentialCode=current?.credentialCode??newCredentialCode();
 const profile=await prisma.$transaction(async tx=>{
  const saved=await tx.journalistProfile.upsert({
   where:{userId},
   create:{userId,slug,professionalTitle,bio,photoUrl,publicContactUrl,credentialCode,status:JournalistVerificationStatus.PENDING,evidenceReference},
   update:{slug,professionalTitle,bio,photoUrl,publicContactUrl,status:JournalistVerificationStatus.PENDING,verifiedAt:null,verifiedById:null,expiresAt:null,evidenceReference},
   select:{id:true,userId:true,slug:true,professionalTitle:true,credentialCode:true,status:true,verifiedAt:true,expiresAt:true,updatedAt:true},
  });
  await tx.auditEvent.create({data:{actorId:actor(res).id,action:"JOURNALIST_PROFILE_UPDATED",entityType:"JournalistProfile",entityId:saved.id,metadata:{userId,slug:saved.slug,status:saved.status}}});
  return saved;
 });
 res.json({data:profile});
}));

router.post("/:userId/verify",asyncHandler(async(req,res)=>{
 const userId=readString(req.params.userId,"userId",128);
 const current=await prisma.journalistProfile.findUnique({where:{userId},include:{user:{select:{disabledAt:true,role:true}}}});
 if(!current||current.user.disabledAt||!eligibleRoles.includes(current.user.role))throw new HttpError(404,"PROFILE_NOT_FOUND","Active newsroom profile not found");
 let expiresAt:Date|null=null;
 if(req.body?.expiresAt!==undefined&&req.body?.expiresAt!==null&&req.body?.expiresAt!==""){
  if(typeof req.body.expiresAt!=="string"||!Number.isFinite(Date.parse(req.body.expiresAt)))throw new HttpError(400,"VALIDATION_ERROR","expiresAt must be a valid ISO date");
  expiresAt=new Date(req.body.expiresAt);if(expiresAt<=new Date())throw new HttpError(400,"VALIDATION_ERROR","expiresAt must be in the future");
 }
 const evidenceReference=optionalText(req.body?.evidenceReference,"evidenceReference",1000)??current.evidenceReference;
 if(!evidenceReference)throw new HttpError(400,"VERIFICATION_EVIDENCE_REQUIRED","Record an internal evidence reference before confirming this affiliation");
 const user=actor(res);
 const profile=await prisma.$transaction(async tx=>{
  const saved=await tx.journalistProfile.update({where:{userId},data:{status:JournalistVerificationStatus.VERIFIED,verifiedAt:new Date(),verifiedById:user.id,expiresAt,evidenceReference},select:{id:true,userId:true,slug:true,credentialCode:true,status:true,verifiedAt:true,expiresAt:true}});
  await tx.auditEvent.create({data:{actorId:user.id,action:"JOURNALIST_AFFILIATION_VERIFIED",entityType:"JournalistProfile",entityId:saved.id,metadata:{userId,credentialCode:saved.credentialCode,expiresAt:saved.expiresAt?.toISOString()??null}}});
  return saved;
 });
 res.json({data:profile});
}));

router.patch("/:userId/status",asyncHandler(async(req,res)=>{
 const userId=readString(req.params.userId,"userId",128);
 const status=req.body?.status;
 const allowed=[JournalistVerificationStatus.PENDING,JournalistVerificationStatus.SUSPENDED,JournalistVerificationStatus.REVOKED];
 if(typeof status!=="string"||!allowed.includes(status as JournalistVerificationStatus))throw new HttpError(400,"VALIDATION_ERROR","status must be PENDING, SUSPENDED or REVOKED; use the verify endpoint to confirm affiliation");
 const current=await prisma.journalistProfile.findUnique({where:{userId},select:{id:true,verifiedAt:true,credentialCode:true}});
 if(!current)throw new HttpError(404,"PROFILE_NOT_FOUND","Journalist profile not found");
 const user=actor(res);
 const profile=await prisma.$transaction(async tx=>{
  const saved=await tx.journalistProfile.update({where:{userId},data:{status:status as JournalistVerificationStatus,...(status===JournalistVerificationStatus.PENDING?{verifiedAt:null,verifiedById:null,expiresAt:null}:{})},select:{id:true,userId:true,slug:true,credentialCode:true,status:true,verifiedAt:true,expiresAt:true}});
  await tx.auditEvent.create({data:{actorId:user.id,action:"JOURNALIST_VERIFICATION_STATUS_CHANGED",entityType:"JournalistProfile",entityId:saved.id,metadata:{userId,fromStatus:current.verifiedAt?"VERIFIED_OR_PREVIOUSLY_VERIFIED":"UNVERIFIED",toStatus:status,credentialCode:current.credentialCode}}});
  return saved;
 });
 res.json({data:profile});
}));
export default router;
