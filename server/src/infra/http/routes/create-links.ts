import { CreateLinkUseCase } from '@/app/use-cases/create-links';
import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-link.repository';
import { isLeft, unwrapEither } from '@/shared/either';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const createLinksRoute: FastifyPluginAsyncZod = async (app) => {
	const linksRepository = new InMemoryLinksRepository();
	const createLinkUseCase = new CreateLinkUseCase(linksRepository);

	app.post(
		'/links',
		{
			schema: {
				body: z.object({
					originalUrl: z.string().url(),
					customUrl: z.string().url(),
				}),
				response: {
					200: z.object({
						id: z.string(),
						originalUrl: z.string(),
						customUrl: z.string(),
						createdAt: z.date(),
					}),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { customUrl, originalUrl } = request.body;

			const result = await createLinkUseCase.execute({
				customUrl,
				originalUrl,
			});

			if (isLeft(result)) {
				const { message } = unwrapEither(result);

				return reply.status(400).send({
					message,
				});
			}

			const linkCreated = unwrapEither(result);

			return reply.status(200).send(linkCreated);
		}
	);
};
