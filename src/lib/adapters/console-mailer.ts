import { randomUUID } from "node:crypto";

import type {
  MailAddress,
  MailPort,
  SendMailInput,
  SendMailResult,
} from "@/lib/ports/mail.port";

/**
 * Console mail adapter for Phase 0.
 *
 * Logs structured metadata only and never sends real email. Body content is
 * summarized (length only) to avoid dumping large or sensitive payloads.
 */
export class ConsoleMailer implements MailPort {
  private readonly provider = "console";

  async sendMail(input: SendMailInput): Promise<SendMailResult> {
    const recipients = this.normalizeAddresses(input.to);
    const cc = this.normalizeAddresses(input.cc);
    const messageId = randomUUID();

    const metadata = {
      provider: this.provider,
      messageId,
      to: recipients.map((address) => this.formatAddress(address)),
      cc: cc.map((address) => this.formatAddress(address)),
      from: input.from ? this.formatAddress(input.from) : "(default sender)",
      subject: input.subject,
      templateId: input.templateId ?? null,
      hasText: Boolean(input.text),
      hasHtml: Boolean(input.html),
      textLength: input.text?.length ?? 0,
      htmlLength: input.html?.length ?? 0,
    };

    console.info("[ConsoleMailer] mail dispatched", metadata);

    return {
      messageId,
      provider: this.provider,
      acceptedRecipients: recipients.length,
    };
  }

  private normalizeAddresses(
    value?: MailAddress | MailAddress[],
  ): MailAddress[] {
    if (!value) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  }

  private formatAddress(address: MailAddress): string {
    return address.name ? `${address.name} <${address.email}>` : address.email;
  }
}
