import { InlineJobRunner } from "@/lib/adapters/inline-job-runner";
import type { QueuePort } from "@/lib/ports/queue.port";

let queueInstance: QueuePort | null = null;

/**
 * Return the active job runner.
 *
 * Phase 0: InlineJobRunner (immediate, in-process, no Redis/workers).
 * Later phases can switch this factory to a real queue adapter.
 */
export function getJobRunner(): QueuePort {
  if (!queueInstance) {
    queueInstance = new InlineJobRunner();
  }
  return queueInstance;
}

export type { QueuePort } from "@/lib/ports/queue.port";
