import { ConsoleMailer } from "@/lib/adapters/console-mailer";
import type { MailPort } from "@/lib/ports/mail.port";

let mailerInstance: MailPort | null = null;

/**
 * Return the active mailer.
 *
 * Phase 0: ConsoleMailer (logs metadata only, no real email).
 * Later phases can switch this factory to an SMTP/provider adapter.
 */
export function getMailer(): MailPort {
  if (!mailerInstance) {
    mailerInstance = new ConsoleMailer();
  }
  return mailerInstance;
}

export type { MailPort } from "@/lib/ports/mail.port";
