import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { app } from '../app';

describe('Delete Link By Short URL e2e', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to delete a link by short url', async () => {
    const link = {
      originalUrl: faker.internet.url(),
      shortUrl: faker.word.sample()
    };

    await db.insert(schema.links).values(link);

    const response = await request(app.server)
      .delete(`/links/${link.shortUrl}`)
      .send();

    expect(response.statusCode).toEqual(200);
  });
});
