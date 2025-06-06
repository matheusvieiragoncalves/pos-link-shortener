import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-link.repository';
import { isRight, unwrapEither } from '@/shared/either';
import { makeLinksInMemory } from 'test/factories/make-links-in-memory';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteLinkByShortUrlUseCase } from './delete-link-by-short-url';
import { ResourceNotFoundError } from './errors/resource-not-found.error';

let linksRepository: InMemoryLinksRepository;
let sut: DeleteLinkByShortUrlUseCase;

describe('Create Links Use Case', () => {
  beforeEach(() => {
    linksRepository = new InMemoryLinksRepository();
    sut = new DeleteLinkByShortUrlUseCase(linksRepository);
  });

  it('should to be able delete link by short url', async () => {
    const link = makeLinksInMemory();

    linksRepository.items.push(link);

    const result = await sut.execute({
      shortUrl: link.shortUrl
    });

    expect(isRight(result)).toBeTruthy();
    expect(linksRepository.items).toHaveLength(0);
  });

  it('should not be possible to delete a short link that does not exist', async () => {
    const result = await sut.execute({
      shortUrl: 'non-existing-url'
    });

    expect(unwrapEither(result)).instanceOf(ResourceNotFoundError);
  });
});
