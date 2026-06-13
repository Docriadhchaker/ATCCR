/**
 * Mail abstraction (Phase 0).
 *
 * Business logic depends on this contract, not on a concrete provider. Phase 0
 * uses a console adapter; later phases can plug in SMTP/transactional providers.
 */

export interface MailAddress {
  name?: string;
  email: string;
}

export interface SendMailInput {
  to: MailAddress | MailAddress[];
  subject: string;
  /** Plain-text body. */
  text?: string;
  /** Optional HTML body. */
  html?: string;
  /** Optional override of the default sender. */
  from?: MailAddress;
  /** Optional CC recipients. */
  cc?: MailAddress | MailAddress[];
  /** Optional logical template identifier (for later providers). */
  templateId?: string;
}

export interface SendMailResult {
  /** Identifier of the dispatched message (synthetic in Phase 0). */
  messageId: string;
  /** Adapter that handled the message, e.g. "console". */
  provider: string;
  /** Number of resolved recipients. */
  acceptedRecipients: number;
}

export interface MailPort {
  sendMail(input: SendMailInput): Promise<SendMailResult>;
}
