import { env } from '@/env';
import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod';
import { createLinksRoute } from './routes/create-links';
import { deleteLinkByShortUrlRoute } from './routes/delete-link-by-short-url';
import { fetchAllLinksRoute } from './routes/fetch-all-links';
import { fetchLinksPaginatedRoute } from './routes/fetch-paginated-links';
import { getLinkByShortUrlAndRedirectRoute } from './routes/get-link-by-short-url-and-redirect';

const app = fastify();

app.register(fastifyCors, { origin: '*' });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler((error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.validation });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});

app.register(createLinksRoute);
app.register(fetchAllLinksRoute);
app.register(fetchLinksPaginatedRoute);
app.register(deleteLinkByShortUrlRoute);
app.register(getLinkByShortUrlAndRedirectRoute);

export { app };
