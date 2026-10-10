import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";

/**
 * Explicit, auditable role promotion. Never runs automatically.
 *
 * Usage:
 *   pnpm admin:promote -- --email=user@example.com --reason="motivo" [--role=ADMIN|CHIEF_EDITOR]
 *
 * The role is taken ONLY from this CLI invocation; the target account has
 * no say in it, and every promotion is written to audit_events.
 */
const prisma = new PrismaClient();

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const found = process.argv.find((value) => value.startsWith(prefix));
  return found ? found.slice(prefix.length).trim() : undefined;
}

async function main(): Promise<void> {
  const email = (arg("email") ?? "").toLowerCase();
  const reason = arg("reason") ?? "";
  const roleArg = arg("role") ?? "ADMIN";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Provide --email=<valid email>");
  }
  if (!reason) {
    throw new Error("Provide --reason=\"<justification>\" (audit requires a reason)");
  }
  if (roleArg !== "ADMIN" && roleArg !== "CHIEF_EDITOR") {
    throw new Error("--role must be ADMIN or CHIEF_EDITOR");
  }
  const role = roleArg as UserRole;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(`No user found for email (register the account first): ${email}`);
  if (user.disabledAt) throw new Error("Target account is disabled; enable it first");

  if (user.role === role) {
    console.log(`No change: ${email} already has role ${role}`);
    return;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.user.update({
      where: { id: user.id },
      data: { role },
      select: { id: true, email: true, role: true },
    });
    await tx.auditEvent.create({
      data: {
        actorId: null,
        action: "USER_ROLE_CHANGED",
        entityType: "User",
        entityId: user.id,
        metadata: { from: user.role, to: role, via: "cli", reason },
      },
    });
    return result;
  });

  console.log(`Promoted: ${updated.email} -> ${updated.role} (audit recorded, reason stored)`);
}

main()
  .catch((error: unknown) => {
    console.error(`admin:promote failed: ${error instanceof Error ? error.message : "unknown error"}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
