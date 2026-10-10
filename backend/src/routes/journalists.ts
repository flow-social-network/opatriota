import { Router } from "express";
import { JournalistVerificationStatus, UserRole } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { asyncHandler, HttpError, readString } from "../lib/http.js";

const router = Router();
const eligibleRoles: UserRole[] = [UserRole.JOURNALIST, UserRole.EDITOR, UserRole.CHIEF_EDITOR, UserRole.ADMIN];
function currentlyVerified(profile: {status: JournalistVerificationStatus; verifiedAt: Date|null; expiresAt: Date|null}, now = new Date()) {
  return profile.status === JournalistVerificationStatus.VERIFIED && profile.verifiedAt !== null && (profile.expiresAt === null || profile.expiresAt > now);
}
const publicWhere = {
  status: JournalistVerificationStatus.VERIFIED,
  verifiedAt: {not: null},
  OR: [{expiresAt: null}, {expiresAt: {gt: new Date()}}],
  user: {is: {disabledAt: null, role: {in: eligibleRoles}}},
};
router.get("/", asyncHandler(async (req,res) => {
  const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
  if(query.length < 2) throw new HttpError(400,"QUERY_REQUIRED","Enter at least two characters or a credential code");
  if(query.length > 100) throw new HttpError(400,"VALIDATION_ERROR","Search query is too long");
  const items = await prisma.journalistProfile.findMany({
    where: {...publicWhere, AND:[{OR:[
      {slug:{contains:query,mode:"insensitive"}},
      {credentialCode:query.toUpperCase()},
      {user:{is:{displayName:{contains:query,mode:"insensitive"}}}},
    ]}]},
    take:20, orderBy:[{verifiedAt:"desc"},{updatedAt:"desc"}],
    select:{slug:true,professionalTitle:true,credentialCode:true,status:true,verifiedAt:true,expiresAt:true,user:{select:{displayName:true}}},
  });
  const now = new Date();
  res.json({data:items.filter(item=>currentlyVerified(item,now)).map(item=>({
    name:item.user.displayName,slug:item.slug,professionalTitle:item.professionalTitle,credentialCode:item.credentialCode,
    verifiedAt:item.verifiedAt,expiresAt:item.expiresAt,outlet:"O Patriota Brasil",verificationStatus:"CONFIRMED",
  }))});
}));
router.get("/:slug", asyncHandler(async (req,res) => {
  const slug = readString(req.params.slug,"slug",120).toLowerCase();
  const now = new Date();
  const profile = await prisma.journalistProfile.findFirst({
    where:{...publicWhere,slug},
    select:{
      slug:true,professionalTitle:true,bio:true,photoUrl:true,publicContactUrl:true,credentialCode:true,status:true,verifiedAt:true,expiresAt:true,
      user:{select:{displayName:true,articles:{
        where:{status:"PUBLISHED",publishedAt:{lte:now}},orderBy:[{publishedAt:"desc"},{createdAt:"desc"}],take:10,
        select:{slug:true,title:true,excerpt:true,publishedAt:true},
      }}},
    },
  });
  if(!profile||!currentlyVerified(profile,now)) throw new HttpError(404,"JOURNALIST_NOT_FOUND","No currently verified newsroom profile was found");
  res.json({data:{
    name:profile.user.displayName,slug:profile.slug,professionalTitle:profile.professionalTitle,bio:profile.bio,
    photoUrl:profile.photoUrl,publicContactUrl:profile.publicContactUrl,credentialCode:profile.credentialCode,
    verificationStatus:"CONFIRMED",verifiedAt:profile.verifiedAt,expiresAt:profile.expiresAt,outlet:"O Patriota Brasil",
    verificationScope:"Confirma o vínculo editorial com O Patriota Brasil; não é credencial emitida por órgão público nem certifica vínculo com outra entidade.",
    articles:profile.user.articles,
  }});
}));
export default router;
