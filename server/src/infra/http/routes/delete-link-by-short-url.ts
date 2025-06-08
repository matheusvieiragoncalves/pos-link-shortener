import { DeleteLinkByShortUrlUseCase } from '@/app/use-cases/delete-link-by-short-url';
import { DrizzleLinksRepository } from '@/repositories/drizzle/drizzle-link.repository';
import { isRight, unwrapEither } from '@/shared/either';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const deleteLinkByShortUrlRoute: FastifyPluginAsyncZod = async (app) => {
  const linksRepository = new DrizzleLinksRepository();
  const deleteLinkByShortUrlUseCase = new DeleteLinkByShortUrlUseCase(
    linksRepository
  );

  app.delete(
    '/links/:shortUrl',
    {
      schema: {
        params: z.object({
          shortUrl: z.string()
        }),
        response: {
          200: z.null(),
          404: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { shortUrl } = request.params;

      const result = await deleteLinkByShortUrlUseCase.execute({ shortUrl });

      if (isRight(result)) {
        return reply.status(200).send();
      }

      const error = unwrapEither(result);

      return reply.status(404).send({ message: error.message });
    }
  );
};
