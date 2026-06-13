/**
 * Phase 0 ports smoke check.
 *
 * Exercises the local adapters end-to-end with fake content only:
 * - storage: save -> exists -> delete -> exists
 * - mailer: console dispatch (metadata only)
 * - pdf: synchronous stub generation
 * - queue: inline job runner (success and failure paths)
 *
 * No real email is sent, no secrets are printed, and any temporary files are
 * removed before exit. Run with: `npm run smoke:ports`.
 */
import { getMailer } from "@/lib/mail";
import { getPdfGenerator } from "@/lib/pdf";
import { getJobRunner } from "@/lib/queue";
import { getStorage } from "@/lib/storage";

type CheckResult = { name: string; ok: boolean; detail: string };

async function checkStorage(): Promise<CheckResult> {
  const storage = getStorage();
  const fakeContent = Buffer.from("fake smoke-test content", "utf8");

  const stored = await storage.saveFile({
    content: fakeContent,
    originalFilename: "smoke-test.txt",
    contentType: "text/plain",
    folder: "smoke-tests",
  });

  const existsAfterSave = await storage.fileExists(stored.storageKey);
  await storage.deleteFile(stored.storageKey);
  const existsAfterDelete = await storage.fileExists(stored.storageKey);

  const ok =
    existsAfterSave &&
    !existsAfterDelete &&
    stored.size === fakeContent.byteLength &&
    stored.originalFilename === "smoke-test.txt";

  return {
    name: "storage",
    ok,
    detail: `saved(${stored.size}b) exists=${existsAfterSave} deleted=${!existsAfterDelete}`,
  };
}

async function checkMailer(): Promise<CheckResult> {
  const mailer = getMailer();
  const result = await mailer.sendMail({
    to: { name: "Demo Participant", email: "demo.participant@example.com" },
    subject: "Smoke test (fake)",
    text: "This is a fake smoke-test message.",
    templateId: "smoke-test",
  });

  const ok = result.acceptedRecipients === 1 && result.provider === "console";
  return {
    name: "mailer",
    ok,
    detail: `provider=${result.provider} accepted=${result.acceptedRecipients}`,
  };
}

async function checkPdf(): Promise<CheckResult> {
  const pdf = getPdfGenerator();
  const result = await pdf.generatePdf({
    documentType: "smoke-test",
    title: "Smoke Test Document",
  });

  const header = Buffer.from(result.content.slice(0, 5)).toString("utf8");
  const ok =
    result.contentType === "application/pdf" &&
    result.size > 0 &&
    header === "%PDF-";

  return {
    name: "pdf",
    ok,
    detail: `generator=${result.generator} size=${result.size}b header=${header}`,
  };
}

async function checkQueue(): Promise<CheckResult> {
  const runner = getJobRunner();
  let sideEffect = 0;

  const success = await runner.dispatch("smoke:increment", { by: 2 }, (p) => {
    sideEffect += p.by;
  });

  const failure = await runner.dispatch("smoke:fail", null, () => {
    throw new Error("intentional smoke failure");
  });

  const ok =
    success.success === true &&
    sideEffect === 2 &&
    failure.success === false &&
    typeof failure.error === "string";

  return {
    name: "queue",
    ok,
    detail: `success=${success.success} failureHandled=${!failure.success}`,
  };
}

async function main(): Promise<void> {
  const checks = [
    await checkStorage(),
    await checkMailer(),
    await checkPdf(),
    await checkQueue(),
  ];

  let allOk = true;
  for (const check of checks) {
    const status = check.ok ? "PASS" : "FAIL";
    if (!check.ok) {
      allOk = false;
    }
    console.info(`[smoke:ports] ${status} ${check.name} — ${check.detail}`);
  }

  if (!allOk) {
    console.error("[smoke:ports] one or more checks failed");
    process.exit(1);
  }

  console.info("[smoke:ports] all checks passed");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`[smoke:ports] fatal: ${message}`);
  process.exit(1);
});
