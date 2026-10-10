import "dotenv/config";
import { UserRole } from "@prisma/client";
import { prisma } from "../backend/src/db/prisma.js";
import { syncGoogleIdentity } from "../backend/src/lib/identitySync.js";
import { HttpError } from "../backend/src/lib/http.js";

let passed = 0;
let failed = 0;

function assert(condition: boolean, description: string): void {
  if (condition) {
    passed += 1;
    console.log(`[PASS] ${description}`);
  } else {
    failed += 1;
    console.error(`[FAIL] ${description}`);
  }
}

async function expectError(fn: () => Promise<unknown>, status: number, code: string): Promise<Error | null> {
  try {
    await fn();
    return null;
  } catch (error) {
    if (error instanceof HttpError && error.status === status && error.code === code) return error;
    throw error;
  }
}

const stamp = Date.now();
const suffix = `${stamp}${Math.floor(Math.random() * 10000)}`;

async function main(): Promise<void> {
  // 1. Novo utilizador Google => READER, nunca aceita papel do cliente
  const created = await syncGoogleIdentity({
    uid: `test-uid-${suffix}`,
    provider: "google.com",
    email: `sync-create-${suffix}@opatriota.test`,
    name: "Sync Create",
    emailVerified: true,
  });
  assert(created.role === UserRole.READER, "novo utilizador Google recebe READER");
  assert(created.firebaseUid === `test-uid-${suffix}`, "firebaseUid associado");
  assert(created.emailVerifiedAt !== null, "emailVerifiedAt preenchido");
  assert(created.passwordHash === null, "conta Google não ganha passwordHash");

  // 2. Re-sync idempotente; displayName não é sobrescrito
  await prisma.user.update({ where: { id: created.id }, data: { displayName: "Nome Customizado" } });
  const resync = await syncGoogleIdentity({
    uid: `test-uid-${suffix}`,
    provider: "google.com",
    email: `sync-create-${suffix}@opatriota.test`,
    name: "Outro Nome Google",
    emailVerified: true,
  });
  assert(resync.id === created.id, "re-sync devolve o mesmo utilizador");
  assert(resync.displayName === "Nome Customizado", "displayName não é sobrescrito no re-sync");

  // 3. Payload com papel extra é ignorado (papel vem só do servidor)
  const withRoleClaim = (await syncGoogleIdentity({
    uid: `test-uid-role-${suffix}`,
    provider: "google.com",
    email: `sync-role-${suffix}@opatriota.test`,
    name: "Role Claim",
    emailVerified: true,
  })) as typeof created & { role: string };
  assert(withRoleClaim.role === UserRole.READER, "claim extra de papel ignorada; papel continua READER");

  // 4. Email já registado por password sem verificação => 409 (anti-takeover)
  const passwordUser = await prisma.user.create({
    data: {
      email: `sync-conflict-${suffix}@opatriota.test`,
      displayName: "Password User",
      passwordHash: "x:y",
      role: UserRole.READER,
    },
  });
  await expectError(
    () => syncGoogleIdentity({ uid: `test-uid-conflict-${suffix}`, provider: "google.com", email: passwordUser.email, emailVerified: true }),
    409,
    "EMAIL_ALREADY_REGISTERED",
  ).then((error) => assert(Boolean(error), "email não verificado bloqueado com 409 (anti-takeover)"));

  // 5. Com emailVerifiedAt no backend, o link é permitido e preserva o papel
  await prisma.user.update({ where: { id: passwordUser.id }, data: { emailVerifiedAt: new Date(), role: UserRole.CHIEF_EDITOR } });
  const linked = await syncGoogleIdentity({
    uid: `test-uid-link-${suffix}`,
    provider: "google.com",
    email: passwordUser.email,
    emailVerified: true,
  });
  assert(linked.id === passwordUser.id, "identidade Google ligada à conta existente verificada");
  assert(linked.role === UserRole.CHIEF_EDITOR, "papel existente preservado no link");
  assert(linked.firebaseUid === `test-uid-link-${suffix}`, "firebaseUid atualizado no link");

  // 6. Conta desativada => 403
  await prisma.user.update({ where: { id: created.id }, data: { disabledAt: new Date() } });
  await expectError(
    () => syncGoogleIdentity({ uid: `test-uid-${suffix}`, provider: "google.com", email: created.email, emailVerified: true }),
    403,
    "ACCOUNT_DISABLED",
  ).then((error) => assert(Boolean(error), "conta desativada rejeitada com 403"));

  // 7. Provedor Facebook => 403
  await expectError(
    () => syncGoogleIdentity({ uid: `test-uid-fb-${suffix}`, provider: "facebook.com", email: `fb-${suffix}@opatriota.test`, emailVerified: true }),
    403,
    "LOGIN_PROVIDER_NOT_ALLOWED",
  ).then((error) => assert(Boolean(error), "provedor Facebook rejeitado com 403"));

  // 8. Email não verificado no Google => 403
  await expectError(
    () => syncGoogleIdentity({ uid: `test-uid-unv-${suffix}`, provider: "google.com", email: `unv-${suffix}@opatriota.test`, emailVerified: false }),
    403,
    "EMAIL_NOT_VERIFIED",
  ).then((error) => assert(Boolean(error), "email não verificado no Google rejeitado com 403"));

  const audits = await prisma.auditEvent.findMany({
    where: { action: { in: ["AUTH_PROFILE_CREATED", "AUTH_IDENTITY_LINKED", "SYNC_LINK_REJECTED", "SYNC_PROVIDER_REJECTED", "SYNC_EMAIL_UNVERIFIED", "SYNC_DISABLED_REJECTED"] }, createdAt: { gte: new Date(Date.now() - 60_000) } },
  });
  const actions = new Set(audits.map((event) => event.action));
  assert(actions.has("AUTH_PROFILE_CREATED"), "audit AUTH_PROFILE_CREATED registado");
  assert(actions.has("AUTH_IDENTITY_LINKED"), "audit AUTH_IDENTITY_LINKED registado");
  assert(actions.has("SYNC_LINK_REJECTED"), "audit SYNC_LINK_REJECTED registado");
  assert(actions.has("SYNC_PROVIDER_REJECTED"), "audit SYNC_PROVIDER_REJECTED registado");
  assert(actions.has("SYNC_DISABLED_REJECTED"), "audit SYNC_DISABLED_REJECTED registado");

  console.log(`\nResultado: ${passed} passaram, ${failed} falharam`);
  if (failed > 0) process.exitCode = 1;
}

main()
  .catch((error: unknown) => {
    console.error("teste abortado:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
