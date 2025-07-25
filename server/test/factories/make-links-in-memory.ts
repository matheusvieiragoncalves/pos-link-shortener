import type { ILink } from '@/@types/link';

import { fakerPT_BR as faker } from '@faker-js/faker';

export function makeLinksInMemory(overrides?: Partial<ILink>) {
  const link: ILink = {
    id: faker.number.int(),
    originalUrl: faker.internet.url(),
    shortUrl: faker.word.sample(),
    createdAt: faker.date.past(),
    accessCount: faker.number.int({ min: 0, max: 1000 }),
    ...overrides
  };

  return link;
}
