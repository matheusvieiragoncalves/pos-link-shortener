import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { faker } from '@faker-js/faker';
import request from 'supertest';
import { app } from '../app';

describe('Create Links e2e', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a link', async () => {
    const response = await request(app.server).post(`/links`).send({
      originalUrl: faker.internet.url(),
      shortUrl: faker.word.sample()
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.link).toEqual(
      expect.objectContaining({
        id: expect.any(Number)
      })
    );
  });
});
