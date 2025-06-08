import type { IGetLinkOutput } from '@/@types/get-link-output';
import type { ILinksRepository } from '@/repositories/links.repository';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { z } from 'zod';
import { ResourceNotFoundError } from './errors/resource-not-found.error';

const getLinkByShortUrlSchema = z.object({
  shortUrl: z.string()
});

type IGetLinkByShortUrlInput = z.infer<typeof getLinkByShortUrlSchema>;

export class GetLinkByShortUrlUseCase {
  constructor(private linksRepository: ILinksRepository) {}

  async execute(
    data: IGetLinkByShortUrlInput
  ): Promise<Either<ResourceNotFoundError, IGetLinkOutput>> {
    const { shortUrl } = getLinkByShortUrlSchema.parse(data);

    const link = await this.linksRepository.findByShortUrl(shortUrl);

    if (!link) {
      return makeLeft(new ResourceNotFoundError());
    }

    const incrementResult =
      await this.linksRepository.incrementLinkAccessCountByShortUrl(
        link.shortUrl
      );

    if (!incrementResult) {
      return makeLeft(new ResourceNotFoundError());
    }

    return makeRight({ link: { ...link, accessCount: link.accessCount } });
  }
}
