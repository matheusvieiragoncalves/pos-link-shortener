import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_ACCESS_SECRET_KEY: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
  CLOUDFLARE_BUCKET_PUBLIC_URL: z.string().url()
});

const checkEnvSchema = envSchema.safeParse(process.env);

if (checkEnvSchema.success === false) {
  console.error(
    '❌ Invalid environment variables.',
    checkEnvSchema.error.format()
  );

  throw new Error('Invalid environment variables.');
}

export const env = checkEnvSchema.data;
