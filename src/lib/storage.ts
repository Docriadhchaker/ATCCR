import { getEnv } from "@/lib/env";
import { LocalFileStorage } from "@/lib/adapters/local-file-storage";
import type { StoragePort } from "@/lib/ports/storage.port";

let storageInstance: StoragePort | null = null;

/**
 * Return the active storage adapter.
 *
 * Phase 0: always LocalFileStorage backed by STORAGE_LOCAL_PATH.
 * Later phases can switch this factory to an object-storage adapter.
 */
export function getStorage(): StoragePort {
  if (!storageInstance) {
    const { STORAGE_LOCAL_PATH } = getEnv();
    storageInstance = new LocalFileStorage(STORAGE_LOCAL_PATH);
  }
  return storageInstance;
}

export type { StoragePort } from "@/lib/ports/storage.port";
