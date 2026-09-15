import { z } from 'zod';

const environmentSchema = z.object({
  VITE_DATA_SOURCE: z.enum(['local', 'http']).default('local'),
  VITE_API_BASE_URL: z.string().default('/api'),
});
export function readEnvironment(source: Record<string, unknown> = import.meta.env) {
  const env = environmentSchema.parse(source);
  if (!/^\/(?!\/)/.test(env.VITE_API_BASE_URL) && !/^https?:\/\//.test(env.VITE_API_BASE_URL))
    throw new Error('VITE_API_BASE_URL must be an HTTP URL or an absolute application path.');
  return { dataSource: env.VITE_DATA_SOURCE, apiBaseUrl: env.VITE_API_BASE_URL };
}
export type AppEnvironment = ReturnType<typeof readEnvironment>;
