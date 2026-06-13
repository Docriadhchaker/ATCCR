/**
 * Storage abstraction (Phase 0).
 *
 * The application never talks to a concrete storage backend directly. Adapters
 * implement this contract so the backend can be swapped later (e.g. S3) without
 * touching business logic.
 */

export interface SaveFileInput {
  /** Raw file content. */
  content: Buffer | Uint8Array;
  /** Original filename provided by the uploader (used for metadata only). */
  originalFilename: string;
  /** Optional MIME type, stored as metadata. */
  contentType?: string;
  /**
   * Optional logical folder/namespace (e.g. "logos", "proofs").
   * Must not contain path traversal segments; adapters sanitize this.
   */
  folder?: string;
}

export interface StoredFile {
  /** Opaque key used to retrieve or delete the file later. */
  storageKey: string;
  /** Original filename preserved as metadata. */
  originalFilename: string;
  /** Stored (sanitized, unique) filename on disk. */
  storedFilename: string;
  /** MIME type if provided at save time. */
  contentType?: string;
  /** File size in bytes. */
  size: number;
}

export interface StoragePort {
  /** Persist file content and return its metadata, including a storage key. */
  saveFile(input: SaveFileInput): Promise<StoredFile>;
  /** Resolve the absolute local filesystem path for a storage key. */
  getFilePath(storageKey: string): string;
  /** Delete a stored file. No-op if it does not exist. */
  deleteFile(storageKey: string): Promise<void>;
  /** Check whether a stored file exists. */
  fileExists(storageKey: string): Promise<boolean>;
}
