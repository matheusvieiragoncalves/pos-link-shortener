import { FetchLinksPaginatedUseCase } from '@/app/use-cases/fetch-links-paginated';
import { DrizzleLinksRepository } from '@/repositories/drizzle/drizzle-link.repository';
import { unwrapEither } from '@/shared/either';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const fetchLinksPaginatedRoute: FastifyPluginAsyncZod = async (app) => {
  const linksRepository = new DrizzleLinksRepository();
  const fetchLinksPaginatedUseCase = new FetchLinksPaginatedUseCase(
    linksRepository
  );

  app.get(
    '/links',
    {
      schema: {
        querystring: z.object({
          cursor: z.coerce.number().optional(),
          pageSize: z.coerce.number().optional(),
          sortDirection: z.enum(['asc', 'desc']).optional()
        }),
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
            nextCursor: z.number().nullable()
          })
        }
      }
    },
    async (request, reply) => {
      const { cursor, pageSize, sortDirection } = request.query;

      const result = await fetchLinksPaginatedUseCase.execute({
        cursor,
        pageSize,
        sortDirection
      });

      const { links, nextCursor } = unwrapEither(result);

      return reply.status(200).send({ links, nextCursor });
    }
  );
};
