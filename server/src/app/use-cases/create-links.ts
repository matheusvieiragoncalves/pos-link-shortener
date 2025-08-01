import type { ICreateLinkOutput } from '@/@types/create-link-output';
import type { ILinksRepository } from '@/repositories/links.repository';
import type { Either } from '@/shared/either';
import { makeLeft, makeRight } from '@/shared/either';
import { z } from 'zod';
import { ShortUrlUnavailableError } from './errors/short-url-unavailable.error';

const createLinkSchema = z.object({
  originalUrl: z.string().url(),
  shortUrl: z.string()
});

type ICreateLinkInput = z.infer<typeof createLinkSchema>;

export class CreateLinkUseCase {
  constructor(private linksRepository: ILinksRepository) {}

  async execute(
    data: ICreateLinkInput
  ): Promise<Either<ShortUrlUnavailableError, ICreateLinkOutput>> {
    const { shortUrl, originalUrl } = createLinkSchema.parse(data);

    const existingLink = await this.linksRepository.findByShortUrl(shortUrl);

    if (existingLink) {
      return makeLeft(new ShortUrlUnavailableError());
    }

    const link = await this.linksRepository.create({
      shortUrl,
      originalUrl
    });

    return makeRight({ link });
  }
}
