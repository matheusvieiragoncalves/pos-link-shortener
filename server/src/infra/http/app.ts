import { env } from '@/env';
import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod';
import { createLinksRoute } from './routes/create-links';
import { fetchAllLinksRoute } from './routes/fetch-all-links';

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

export { app };
