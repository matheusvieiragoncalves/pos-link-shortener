import type { ICreateLinkOutput } from '@/@types/create-link-output';

import type { IFetchLinksOutput } from '@/@types/fetch-links-output';
import type { IGetLinkOutput } from '@/@types/get-link-output';
import type { ICreateLinkInput, ILink } from '@/@types/link';

import { ResourceNotFoundError } from '@/app/use-cases/errors/resource-not-found.error';
import { ShortUrlUnavailableError } from '@/app/use-cases/errors/short-url-unavailable.error';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { randomUUID } from 'node:crypto';
import type { ILinksRepository } from '../links.repository';

export class InMemoryLinksRepository implements ILinksRepository {
  public items: ILink[] = [];

  async fetchAllLinks(): Promise<Either<never, IFetchLinksOutput>> {
    return makeRight({
      links: this.items,
      totalCount: this.items.length
    });
  }

  async fetchLinksPaginated(
    page = 1,
    pageSize = 20,
    sortDirection?: 'asc' | 'desc',
    sortBy?: 'createdAt'
  ): Promise<Either<never, IFetchLinksOutput>> {
    const sortedItems = [...this.items].sort((a, b) => {
      if (sortBy === 'createdAt') {
        return sortDirection === 'asc'
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      }
      return 0;
    });

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const links = sortedItems.slice(startIndex, endIndex);
    const totalCount = sortedItems.length;

    return makeRight({ links, totalCount });
  }

  async findByShortUrl(
    shortUrl: string
  ): Promise<Either<never, IGetLinkOutput | null>> {
    const link = this.items.find((item) => item.shortUrl === shortUrl);

    if (!link) {
      return makeRight(null);
    }

    return makeRight({ link: { ...link } });
  }

  async create(
    data: ICreateLinkInput
  ): Promise<Either<Error, ICreateLinkOutput>> {
    const { originalUrl, shortUrl } = data;

    const link: ILink = {
      id: randomUUID(),
      originalUrl,
      shortUrl,
      createdAt: new Date(),
      accessCount: 0
    };

    const urlAlredyExists = this.items.some(
      (item) => item.shortUrl === shortUrl
    );

    // Check if the custom URL already exists in the repository - simulating a database unique constraint
    if (urlAlredyExists) {
      return makeLeft(new ShortUrlUnavailableError());
    }

    this.items.push(link);

    return makeRight({ link });
  }

  async incrementLinkAccessCountById(
    id: string
  ): Promise<Either<ResourceNotFoundError, null>> {
    const link = this.items.find((item) => item.id === id);

    if (!link) {
      return makeLeft(new ResourceNotFoundError());
    }

    link.accessCount += 1;

    return makeRight(null);
  }

  async deleteByShortUrl(
    shortUrl: string
  ): Promise<Either<ResourceNotFoundError, null>> {
    const index = this.items.findIndex((i) => i.shortUrl === shortUrl);

    if (index < 0) return makeLeft(new ResourceNotFoundError());

    this.items.splice(index, 1);

    return makeRight(null);
  }
}
