import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-link.repository';
import { unwrapEither } from '@/shared/either';
import { makeLinksInMemory } from 'test/factories/make-links-in-memory';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchAllLinksUseCase } from './fetch-all-links';

let linksRepository: InMemoryLinksRepository;
let sut: FetchAllLinksUseCase;

describe('Create Links Use Case', () => {
  beforeEach(() => {
    linksRepository = new InMemoryLinksRepository();
    sut = new FetchAllLinksUseCase(linksRepository);
  });

  it('should to be able get all links', async () => {
    const AMOUNT_LINKS_TO_TEST = 3;

    for (let i = 0; i < AMOUNT_LINKS_TO_TEST; i++) {
      const link = makeLinksInMemory({
        id: linksRepository.createAutoIncrementId()
      });
      linksRepository.items.push(link);
    }

    const result = await sut.execute();

    const { totalCount, links } = unwrapEither(result);

    expect(totalCount).toEqual(AMOUNT_LINKS_TO_TEST);

    expect(links).toEqual([
      expect.objectContaining({
        id: expect.any(Number)
      }),
      expect.objectContaining({
        id: expect.any(Number)
      }),
      expect.objectContaining({
        id: expect.any(Number)
      })
    ]);
  });
});
