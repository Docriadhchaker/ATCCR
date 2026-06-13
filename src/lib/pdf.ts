import { SyncPdfGenerator } from "@/lib/adapters/sync-pdf-generator";
import type { PdfPort } from "@/lib/ports/pdf.port";

let pdfInstance: PdfPort | null = null;

/**
 * Return the active PDF generator.
 *
 * Phase 0: SyncPdfGenerator (placeholder document, no heavy renderer).
 * Later phases can switch this factory to a real PDF renderer.
 */
export function getPdfGenerator(): PdfPort {
  if (!pdfInstance) {
    pdfInstance = new SyncPdfGenerator();
  }
  return pdfInstance;
}

export type { PdfPort } from "@/lib/ports/pdf.port";
