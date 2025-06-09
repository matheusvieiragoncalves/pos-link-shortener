import { GetLinkByShortUrlUseCase } from '@/app/use-cases/get-link-by-short-url';
import { DrizzleLinksRepository } from '@/repositories/drizzle/drizzle-link.repository';
import { isRight, unwrapEither } from '@/shared/either';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const getLinkByShortUrlAndRedirectRoute: FastifyPluginAsyncZod = async (
  app
) => {
  const linksRepository = new DrizzleLinksRepository();
  const getLinkByShortUrlUseCase = new GetLinkByShortUrlUseCase(
    linksRepository
  );

  app.get(
    '/links/:shortUrl',
    {
      schema: {
        params: z.object({
          shortUrl: z.string()
        }),
        response: {
          302: z.null(),
          404: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { shortUrl } = request.params;

      const result = await getLinkByShortUrlUseCase.execute({
        shortUrl
      });

      if (isRight(result)) {
        const { link } = unwrapEither(result);

        return reply.redirect(link.originalUrl);
      }

      const error = unwrapEither(result);

      return reply.status(404).send({ message: error.message });
    }
  );
};
