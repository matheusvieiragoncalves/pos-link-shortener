import { FetchAllLinksUseCase } from '@/app/use-cases/fetch-all-links';
import { DrizzleLinksRepository } from '@/repositories/drizzle/drizzle-link.repository';
import { unwrapEither } from '@/shared/either';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const fetchAllLinksRoute: FastifyPluginAsyncZod = async (app) => {
  const linksRepository = new DrizzleLinksRepository();
  const fetchAllLinksUseCase = new FetchAllLinksUseCase(linksRepository);

  app.get(
    '/links-all',
    {
      schema: {
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.number(),
                originalUrl: z.string().url(),
                shortUrl: z.string(),
                accessCount: z.number(),
                createdAt: z.date().nullable()
              })
            ),
            totalCount: z.number()
          })
        }
      }
    },
    async (_, reply) => {
      const result = await fetchAllLinksUseCase.execute();

      const { links, totalCount } = unwrapEither(result);

      return reply.status(200).send({ links, totalCount });
    }
  );
};
