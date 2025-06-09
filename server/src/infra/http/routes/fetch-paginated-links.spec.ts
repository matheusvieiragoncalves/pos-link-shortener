import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { app } from '../app';

describe('Fetch paginated links e2e', () => {
  beforeAll(async () => {
    await app.ready();
    await db.delete(schema.links);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list the links registred', async () => {
    const AMOUNT_ITEMS_TO_TEST = 20;
    const pageSize = 20;

    for (let i = 0; i < AMOUNT_ITEMS_TO_TEST; i++) {
      await db.insert(schema.links).values({
        originalUrl: faker.internet.url(),
        shortUrl: faker.word.sample() + i
      });
    }

    const page1 = await request(app.server)
      .get(`/links`)
      .query({
        pageSize
      })
      .send();

    const { nextCursor } = page1.body;

    const page2 = await request(app.server)
      .get(`/links`)
      .query({
        cursor: nextCursor,
        pageSize
      })
      .send();

    expect(page1.statusCode).toEqual(200);
    expect(page1.body.nextCursor).toBeTruthy();

    expect(page2.statusCode).toEqual(200);
    expect(page2.body.nextCursor).toBeNull();
  });
});
