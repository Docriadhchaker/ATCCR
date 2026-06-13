import { z } from "zod";

/**
 * Phase 0 environment contract. Only the variables required by the current
 * phase are validated here. Values are never logged; on failure we expose the
 * offending variable names only.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  STORAGE_LOCAL_PATH: z.string().min(1, "STORAGE_LOCAL_PATH is required"),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

/**
 * Parse and validate the Phase 0 environment variables.
 *
 * Throws a redacted error listing only the names of invalid/missing variables.
 * Actual values are never included in the error message.
 */
export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    STORAGE_LOCAL_PATH: process.env.STORAGE_LOCAL_PATH,
  });

  if (!parsed.success) {
    const invalidKeys = [
      ...new Set(parsed.error.issues.map((issue) => issue.path.join("."))),
    ];
    throw new Error(
      `Invalid environment configuration. Check these variables: ${invalidKeys.join(", ")}`,
    );
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
