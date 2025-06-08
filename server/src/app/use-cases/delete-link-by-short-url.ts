import type { ILinksRepository } from '@/repositories/links.repository';
import { makeLeft, makeRight, type Either } from '@/shared/either';
import { z } from 'zod';
import { ResourceNotFoundError } from './errors/resource-not-found.error';

const deleteLinkByShortUrlSchema = z.object({
  shortUrl: z.string()
});

type IDeleteLinkByShortUrlInput = z.infer<typeof deleteLinkByShortUrlSchema>;

export class DeleteLinkByShortUrlUseCase {
  constructor(private linksRepository: ILinksRepository) {}

  async execute(
    data: IDeleteLinkByShortUrlInput
  ): Promise<Either<ResourceNotFoundError, null>> {
    const { shortUrl } = deleteLinkByShortUrlSchema.parse(data);

    const linkExisting = await this.linksRepository.findByShortUrl(shortUrl);

    if (!linkExisting) {
      return makeLeft(new ResourceNotFoundError());
    }

    const result = await this.linksRepository.deleteByShortUrl(shortUrl);

    return makeRight(result);
  }
}
