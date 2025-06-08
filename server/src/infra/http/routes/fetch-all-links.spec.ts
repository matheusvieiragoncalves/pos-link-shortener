import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { app } from '../app';

describe('Fetch all links e2e', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list the links registred', async () => {
    await db.insert(schema.links).values({
      originalUrl: faker.internet.url(),
      shortUrl: faker.word.sample()
    });

    const response = await request(app.server).get(`/links-all`).send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.totalCount > 0).toBeTruthy();
  });
});
