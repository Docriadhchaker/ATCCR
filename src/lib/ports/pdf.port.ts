/**
 * PDF abstraction (Phase 0).
 *
 * Phase 0 uses a lightweight stub. Later phases can plug in a real renderer
 * (e.g. a headless browser) behind this same contract.
 */

export interface GeneratePdfInput {
  /** Logical document kind, e.g. "badge", "certificate", "invoice". */
  documentType: string;
  /** Arbitrary template data used by the renderer. */
  data?: Record<string, unknown>;
  /** Optional display title for the document. */
  title?: string;
}

export interface GeneratedPdf {
  /** PDF bytes. In Phase 0 this is a minimal placeholder document. */
  content: Uint8Array;
  /** MIME type, always "application/pdf". */
  contentType: "application/pdf";
  /** Byte length of the generated content. */
  size: number;
  /** Document kind echoed back for traceability. */
  documentType: string;
  /** Renderer that produced the document, e.g. "sync-stub". */
  generator: string;
}

export interface PdfPort {
  generatePdf(input: GeneratePdfInput): Promise<GeneratedPdf>;
}
