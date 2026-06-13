import { randomUUID } from "node:crypto";
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  SaveFileInput,
  StoragePort,
  StoredFile,
} from "@/lib/ports/storage.port";

/**
 * Local filesystem storage adapter for Phase 0.
 *
 * - Stores files under the configured base directory (STORAGE_LOCAL_PATH).
 * - Generates unique, collision-free filenames.
 * - Sanitizes folder/filename input and prevents path traversal: every
 *   resolved path is verified to stay inside the base directory.
 */
export class LocalFileStorage implements StoragePort {
  private readonly baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = path.resolve(baseDir);
  }

  async saveFile(input: SaveFileInput): Promise<StoredFile> {
    const folder = this.sanitizeFolder(input.folder);
    const originalFilename = input.originalFilename?.trim() || "file";
    const safeExtension = this.safeExtension(originalFilename);
    const storedFilename = `${randomUUID()}${safeExtension}`;

    const storageKey = folder
      ? `${folder}/${storedFilename}`
      : storedFilename;

    const absolutePath = this.resolveKey(storageKey);
    await mkdir(path.dirname(absolutePath), { recursive: true });

    const content = Buffer.isBuffer(input.content)
      ? input.content
      : Buffer.from(input.content);
    await writeFile(absolutePath, content);

    return {
      storageKey,
      originalFilename,
      storedFilename,
      contentType: input.contentType,
      size: content.byteLength,
    };
  }

  getFilePath(storageKey: string): string {
    return this.resolveKey(storageKey);
  }

  async deleteFile(storageKey: string): Promise<void> {
    const absolutePath = this.resolveKey(storageKey);
    await rm(absolutePath, { force: true });
  }

  async fileExists(storageKey: string): Promise<boolean> {
    const absolutePath = this.resolveKey(storageKey);
    try {
      await stat(absolutePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Resolve a storage key to an absolute path inside the base directory.
   * Rejects any key that would escape the base directory (path traversal).
   */
  private resolveKey(storageKey: string): string {
    if (!storageKey || typeof storageKey !== "string") {
      throw new Error("Invalid storage key");
    }

    const normalizedKey = storageKey.replace(/\\/g, "/");
    const absolutePath = path.resolve(this.baseDir, normalizedKey);
    const relative = path.relative(this.baseDir, absolutePath);

    if (
      relative === "" ||
      relative.startsWith("..") ||
      path.isAbsolute(relative)
    ) {
      throw new Error("Resolved path escapes the storage directory");
    }

    return absolutePath;
  }

  /**
   * Sanitize an optional folder into a safe relative segment.
   * Strips traversal, absolute, and unsafe characters.
   */
  private sanitizeFolder(folder?: string): string {
    if (!folder) {
      return "";
    }

    return folder
      .replace(/\\/g, "/")
      .split("/")
      .map((segment) =>
        segment.replace(/[^a-zA-Z0-9._-]/g, "").replace(/^\.+$/, ""),
      )
      .filter((segment) => segment.length > 0)
      .join("/");
  }

  /** Extract a safe, lowercase file extension (alphanumeric only). */
  private safeExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    if (!ext) {
      return "";
    }
    const cleaned = ext.replace(/[^a-z0-9.]/g, "");
    return /^\.[a-z0-9]+$/.test(cleaned) ? cleaned : "";
  }
}
