import { ExportLinksUseCase } from '@/app/use-cases/export-csv';
import { DrizzleLinksRepository } from '@/repositories/drizzle/drizzle-link.repository';
import { unwrapEither } from '@/shared/either';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const ExportLinksRoute: FastifyPluginAsyncZod = async (app) => {
  const linksRepository = new DrizzleLinksRepository();
  const exportLinksUseCase = new ExportLinksUseCase(linksRepository);

  app.get(
    '/links/exports',
    {
      schema: {
        response: {
          200: z.object({
            url: z.string()
          })
        }
      }
    },
    async (_, reply) => {
      const result = await exportLinksUseCase.execute();

      const { url } = unwrapEither(result);

      return reply.status(200).send({ url });
    }
  );
};
