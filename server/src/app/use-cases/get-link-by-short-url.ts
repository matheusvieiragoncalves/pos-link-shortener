import type { IGetLinkOutput } from '@/@types/get-link-output';
import type { ILinksRepository } from '@/repositories/links.repository';
import { type Either, isLeft, makeRight, unwrapEither } from '@/shared/either';
import { z } from 'zod';
import type { ResourceNotFoundError } from './errors/resource-not-found.error';

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

    const result = await this.linksRepository.findByShortUrl(shortUrl);

    if (isLeft(result)) {
      return result;
    }

    const { link } = unwrapEither(result);

    const incrementResult =
      await this.linksRepository.incrementLinkAccessCountByShortUrl(
        link.shortUrl
      );

    if (isLeft(incrementResult)) {
      return incrementResult;
    }

    return makeRight({ link: { ...link, accessCount: link.accessCount + 1 } });
  }
}
