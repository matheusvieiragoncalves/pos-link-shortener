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

  it('should be able to grab the 10 most recent records', async () => {
    const AMOUNT_LINKS_TO_TEST = 50;
    const pageSize = 10;
    const sortDirection = 'desc';

    vi.setSystemTime(new Date(2022, 1, 0, 8, 0, 0));

    for (let i = 1; i <= AMOUNT_LINKS_TO_TEST; i++) {
      const link = makeLinksInMemory({
        id: linksRepository.createAutoIncrementId(),
        shortUrl: `example-${i}`,
        createdAt: dayjs().subtract(i, 'day').toDate()
      });
      linksRepository.items.push(link);
    }

    const result = await sut.execute({
      pageSize,
      sortDirection
    });

    const { totalCount, links } = unwrapEither(result);

    expect(totalCount).toBe(AMOUNT_LINKS_TO_TEST);
    expect(links).toHaveLength(pageSize);
  });

  it('should be able to grab 5 pages of content', async () => {
    const AMOUNT_LINKS_TO_TEST = 50;
    const pageSize = 10;
    const sortDirection = 'desc';

    vi.setSystemTime(new Date(2022, 1, 0, 8, 0, 0));

    for (let i = 1; i <= AMOUNT_LINKS_TO_TEST; i++) {
      const link = makeLinksInMemory({
        id: linksRepository.createAutoIncrementId(),
        shortUrl: `example-${i}`,
        createdAt: dayjs().subtract(i, 'day').toDate()
      });
      linksRepository.items.push(link);
    }

    const page1 = await sut.execute({
      pageSize,
      sortDirection
    });

    const { nextCursor: cursorToPageTwo } = unwrapEither(page1);

    const page2 = await sut.execute({
      pageSize,
      sortDirection,
      cursor: cursorToPageTwo as number
    });

    const { nextCursor: cursorToPageThree } = unwrapEither(page2);

    const page3 = await sut.execute({
      pageSize,
      sortDirection,
      cursor: cursorToPageThree as number
    });

    const { nextCursor: cursorToPageFour } = unwrapEither(page3);

    const page4 = await sut.execute({
      pageSize,
      sortDirection,
      cursor: cursorToPageFour as number
    });

    const { nextCursor: cursorToPageFive } = unwrapEither(page4);

    const page5 = await sut.execute({
      pageSize,
      sortDirection,
      cursor: cursorToPageFive as number
    });

    expect([
      cursorToPageTwo,
      cursorToPageThree,
      cursorToPageFour,
      cursorToPageFive
    ]).toEqual([41, 31, 21, 11]);

    expect(unwrapEither(page5)).toEqual({
      links: expect.any(Array),
      nextCursor: expect.any(Number),
      totalCount: expect.any(Number)
    });
  });

  it('should return null cursor if there is no next page', async () => {
    const AMOUNT_LINKS_TO_TEST = 6;
    const pageSize = 10;
    const sortDirection = 'desc';

    vi.setSystemTime(new Date(2022, 1, 0, 8, 0, 0));

    for (let i = 1; i <= AMOUNT_LINKS_TO_TEST; i++) {
      const link = makeLinksInMemory({
        id: linksRepository.createAutoIncrementId(),
        shortUrl: `example-${i}`,
        createdAt: dayjs().subtract(i, 'day').toDate()
      });
      linksRepository.items.push(link);
    }

    const result = await sut.execute({
      pageSize,
      sortDirection
    });

    const { nextCursor } = unwrapEither(result);

    expect(nextCursor).toBe(null);
  });
});
