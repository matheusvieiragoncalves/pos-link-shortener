import { CreateLinkUseCase } from '@/app/use-cases/create-links';
import { DrizzleLinksRepository } from '@/repositories/drizzle/drizzle-link.repository';
import { isLeft, unwrapEither } from '@/shared/either';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const createLinksRoute: FastifyPluginAsyncZod = async (app) => {
  const linksRepository = new DrizzleLinksRepository();
  const createLinkUseCase = new CreateLinkUseCase(linksRepository);

  app.post(
    '/links',
    {
      schema: {
        body: z.object({
          originalUrl: z.string().url(),
          shortUrl: z.string()
        }),
        response: {
          200: z.object({
            link: z.object({
              id: z.number(),
              originalUrl: z.string().url(),
              shortUrl: z.string(),
              accessCount: z.number(),
              createdAt: z.date().nullable()
            })
          }),
          400: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { shortUrl, originalUrl } = request.body;

      const result = await createLinkUseCase.execute({
        shortUrl,
        originalUrl
      });

      if (isLeft(result)) {
        const { message } = unwrapEither(result);

        return reply.status(400).send({
          message
        });
      }

      const linkCreated = unwrapEither(result);

      return reply.status(200).send(linkCreated);
    }
  );
};
