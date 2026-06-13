/**
 * Queue abstraction (Phase 0).
 *
 * Business logic dispatches background work through this contract. Phase 0 runs
 * jobs inline (same process, immediately). Later phases can plug in a real
 * queue (e.g. BullMQ + Redis) without changing call sites.
 */

export type JobHandler<TPayload> = (payload: TPayload) => Promise<void> | void;

export interface DispatchResult {
  jobName: string;
  /** Whether the handler completed without throwing. */
  success: boolean;
  /** Error message if the handler failed (no stack, no sensitive data). */
  error?: string;
  /** How the job was processed, e.g. "inline". */
  mode: string;
}

export interface QueuePort {
  /**
   * Dispatch a named job with a payload and a handler.
   *
   * Implementations decide when/where the handler runs. The returned result
   * reports success/failure rather than throwing, so callers can react without
   * try/catch around every dispatch.
   */
  dispatch<TPayload>(
    jobName: string,
    payload: TPayload,
    handler: JobHandler<TPayload>,
  ): Promise<DispatchResult>;
}
