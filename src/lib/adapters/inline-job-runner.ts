import type {
  DispatchResult,
  JobHandler,
  QueuePort,
} from "@/lib/ports/queue.port";

/**
 * Inline job runner for Phase 0.
 *
 * Executes the handler immediately in the current process. Errors are caught
 * and returned in a structured result instead of propagating, so a failing
 * background job never crashes the dispatching request. No Redis or workers.
 */
export class InlineJobRunner implements QueuePort {
  private readonly mode = "inline";

  async dispatch<TPayload>(
    jobName: string,
    payload: TPayload,
    handler: JobHandler<TPayload>,
  ): Promise<DispatchResult> {
    try {
      await handler(payload);
      return { jobName, success: true, mode: this.mode };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown job error";
      console.error("[InlineJobRunner] job failed", { jobName, error: message });
      return { jobName, success: false, error: message, mode: this.mode };
    }
  }
}
