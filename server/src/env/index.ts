import { z } from 'zod';

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
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
