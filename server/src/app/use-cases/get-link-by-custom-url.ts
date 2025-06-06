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
  ): Promise<Either<ResourceNotFoundError, IGetLinkOutput | null>> {
    const { shortUrl } = getLinkByShortUrlSchema.parse(data);

    const result = await this.linksRepository.findByShortUrl(shortUrl);

    if (isLeft(result)) {
      return result;
    }

    const existingLink = unwrapEither(result);

    if (!existingLink) {
      return makeRight(null);
    }

    const incrementResult =
      await this.linksRepository.incrementLinkAccessCountById(
        existingLink.link.id
      );

    if (isLeft(incrementResult)) {
      return incrementResult;
    }

    const { link } = existingLink;

    return makeRight({ link: { ...link, accessCount: link.accessCount + 1 } });
  }
}
