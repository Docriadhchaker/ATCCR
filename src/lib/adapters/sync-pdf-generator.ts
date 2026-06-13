import type {
  GeneratePdfInput,
  GeneratedPdf,
  PdfPort,
} from "@/lib/ports/pdf.port";

/**
 * Synchronous PDF stub for Phase 0.
 *
 * Produces a minimal but structurally valid single-page PDF placeholder so
 * downstream code (storage, downloads) can be exercised end-to-end without a
 * heavy rendering dependency. No Puppeteer or PDF libraries are used.
 */
export class SyncPdfGenerator implements PdfPort {
  private readonly generator = "sync-stub";

  async generatePdf(input: GeneratePdfInput): Promise<GeneratedPdf> {
    const title = input.title ?? input.documentType;
    const content = this.buildPlaceholderPdf(title);

    return {
      content,
      contentType: "application/pdf",
      size: content.byteLength,
      documentType: input.documentType,
      generator: this.generator,
    };
  }

  /**
   * Build a minimal valid PDF (single page, one text line) as bytes.
   * This is a placeholder, not a production-quality document.
   */
  private buildPlaceholderPdf(title: string): Uint8Array {
    const safeTitle = title.replace(/[()\\]/g, " ").slice(0, 120);
    const body = [
      "%PDF-1.4",
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] " +
        "/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >> endobj",
      `4 0 obj << /Length 0 >> stream\nBT /F1 18 Tf 72 760 Td (${safeTitle}) Tj ET\nendstream endobj`,
      "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
      "trailer << /Root 1 0 R >>",
      "%%EOF",
      "",
    ].join("\n");

    return new TextEncoder().encode(body);
  }
}
