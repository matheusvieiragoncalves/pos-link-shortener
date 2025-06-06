import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-link.repository';
import { unwrapEither } from '@/shared/either';
import dayjs from 'dayjs';
import { makeLinksInMemory } from 'test/factories/make-links-in-memory';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchLinksPaginatedUseCase } from './fetch-links-paginated';

let linksRepository: InMemoryLinksRepository;
let sut: FetchLinksPaginatedUseCase;

describe('Create Links Use Case', () => {
  beforeEach(() => {
    linksRepository = new InMemoryLinksRepository();
    sut = new FetchLinksPaginatedUseCase(linksRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to grab the 5 most recent records', async () => {
    const AMOUNT_LINKS_TO_TEST = 20;
    const pageSize = 5;
    const sortBy = 'createdAt';
    const sortDirection = 'desc';

    vi.setSystemTime(new Date(2022, 1, 0, 8, 0, 0));

    for (let i = 1; i <= AMOUNT_LINKS_TO_TEST; i++) {
      const link = makeLinksInMemory({
        shortUrl: `https://example.com/${i}`,
        createdAt: dayjs().subtract(i, 'day').toDate()
      });
      linksRepository.items.push(link);
    }

    const result = await sut.execute({
      page: 1,
      pageSize,
      sortBy,
      sortDirection
    });

    const { totalCount, links } = unwrapEither(result);

    expect(totalCount).toBe(AMOUNT_LINKS_TO_TEST);
    expect(links.length).toBe(pageSize);
    expect(links).toEqual([
      expect.objectContaining({
        createdAt: dayjs().subtract(1, 'day').toDate()
      }),
      expect.objectContaining({
        createdAt: dayjs().subtract(2, 'day').toDate()
      }),
      expect.objectContaining({
        createdAt: dayjs().subtract(3, 'day').toDate()
      }),
      expect.objectContaining({
        createdAt: dayjs().subtract(4, 'day').toDate()
      }),
      expect.objectContaining({
        createdAt: dayjs().subtract(5, 'day').toDate()
      })
    ]);
  });

  it('should be able to grab the 5 oldest records', async () => {
    const AMOUNT_LINKS_TO_TEST = 20;
    const pageSize = 5;
    const sortBy = 'createdAt';
    const sortDirection = 'asc';

    vi.setSystemTime(new Date(2022, 1, 0, 8, 0, 0));

    for (let i = 1; i <= AMOUNT_LINKS_TO_TEST; i++) {
      const link = makeLinksInMemory({
        shortUrl: `https://example.com/${i}`,
        createdAt: dayjs().add(i, 'day').toDate()
      });
      linksRepository.items.push(link);
    }

    const result = await sut.execute({
      page: 1,
      pageSize,
      sortBy,
      sortDirection
    });

    const { totalCount, links } = unwrapEither(result);

    expect(totalCount).toBe(AMOUNT_LINKS_TO_TEST);
    expect(links.length).toBe(pageSize);
    expect(links).toEqual([
      expect.objectContaining({
        createdAt: dayjs().add(1, 'day').toDate()
      }),
      expect.objectContaining({
        createdAt: dayjs().add(2, 'day').toDate()
      }),
      expect.objectContaining({
        createdAt: dayjs().add(3, 'day').toDate()
      }),
      expect.objectContaining({
        createdAt: dayjs().add(4, 'day').toDate()
      }),
      expect.objectContaining({
        createdAt: dayjs().add(5, 'day').toDate()
      })
    ]);
  });
});
