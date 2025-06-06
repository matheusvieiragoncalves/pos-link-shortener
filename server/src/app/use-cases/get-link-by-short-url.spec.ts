import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-link.repository';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { makeLinksInMemory } from 'test/factories/make-links-in-memory';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { GetLinkByShortUrlUseCase } from './get-link-by-short-url';

let linksRepository: InMemoryLinksRepository;
let sut: GetLinkByShortUrlUseCase;

describe('Create Links Use Case', () => {
  beforeEach(() => {
    linksRepository = new InMemoryLinksRepository();
    sut = new GetLinkByShortUrlUseCase(linksRepository);
  });

  it('should to be able get link by short url', async () => {
    const link = makeLinksInMemory();

    linksRepository.items.push(link);

    const result = await sut.execute({
      shortUrl: link.shortUrl
    });

    expect(isRight(result)).toBeTruthy();
  });

  it('should not to be able get link by short url if not exists', async () => {
    const result = await sut.execute({
      shortUrl: 'non-existing-url'
    });

    expect(unwrapEither(result)).instanceOf(ResourceNotFoundError);
  });

  it('should be able to increment the link access counter whenever it is clicked', async () => {
    const newLink = makeLinksInMemory();
    linksRepository.items.push({ ...newLink });

    const getResult = await sut.execute({
      shortUrl: newLink.shortUrl
    });

    expect(isRight(getResult)).toBeTruthy();

    if (isLeft(getResult)) {
      return;
    }

    const { link } = unwrapEither(getResult);

    expect(link.accessCount).toBe(newLink.accessCount + 1);
  });
});
