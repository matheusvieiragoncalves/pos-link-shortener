import type { ICreateLinkOutput } from '@/@types/create-link-output';

import type { IFetchLinksOutput } from '@/@types/fetch-links-output';
import type { IGetLinkOutput } from '@/@types/get-link-output';
import type { ICreateLinkInput, ILink } from '@/@types/link';

import { IFetchLinksPaginatedOutput } from '@/@types/fetch-links-output-paginated';
import { ResourceNotFoundError } from '@/app/use-cases/errors/resource-not-found.error';
import { ShortUrlUnavailableError } from '@/app/use-cases/errors/short-url-unavailable.error';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { Readable } from 'node:stream';
import type { ILinksRepository } from '../links.repository';

export class InMemoryLinksRepository implements ILinksRepository {
  public items: ILink[] = [];

  createAutoIncrementId(): number {
    return this.items.length + 1;
  }

  async fetchAllLinks(): Promise<Either<never, IFetchLinksOutput>> {
    return makeRight({
      links: this.items,
      totalCount: this.items.length
    });
  }

  async fetchLinksPaginated(
    cursor = null,
    pageSize = 20,
    sortDirection: 'asc' | 'desc' = 'asc'
  ): Promise<Either<never, IFetchLinksPaginatedOutput>> {
    const sortedItems = [...this.items].sort((a, b) => {
      return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
    });

    const filteredItems = sortedItems.filter((item) => {
      if (!cursor) return true;

      if (sortDirection === 'asc') return item.id > cursor;
      else return item.id < cursor;
    });

    const links = filteredItems.slice(0, pageSize);

    let nextCursor = null;

    if (links?.length === pageSize && links[links.length - 1]?.id) {
      nextCursor = links[links.length - 1].id;
    }

    const totalCount = this.items.length;

    return makeRight({ links, totalCount, nextCursor });
  }

  async findByShortUrl(
    shortUrl: string
  ): Promise<Either<ResourceNotFoundError, IGetLinkOutput>> {
    const link = this.items.find((item) => item.shortUrl === shortUrl);

    if (!link) {
      return makeLeft(new ResourceNotFoundError());
    }

    return makeRight({ link: { ...link } });
  }

  async create(
    data: ICreateLinkInput
  ): Promise<Either<Error, ICreateLinkOutput>> {
    const { originalUrl, shortUrl } = data;

    const link: ILink = {
      id: this.items.length + 1,
      originalUrl,
      shortUrl,
      createdAt: new Date(),
      accessCount: 0
    };

    const urlAlredyExists = this.items.some(
      (item) => item.shortUrl === shortUrl
    );

    // Check if the short URL already exists in the repository - simulating a database unique constraint
    if (urlAlredyExists) {
      return makeLeft(new ShortUrlUnavailableError());
    }

    this.items.push(link);

    return makeRight({ link });
  }

  async incrementLinkAccessCountByShortUrl(
    shortUrl: string
  ): Promise<Either<ResourceNotFoundError, null>> {
    const link = this.items.find((item) => item.shortUrl === shortUrl);

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

  getCursorToCSVExport(): Readable {
    let dataToExport = [...this.items];

    let index = 0;
    const batchSize = 2;

    return new Readable({
      objectMode: true,
      read() {
        const chunk = dataToExport.slice(index, index + batchSize);
        index += batchSize;

        if (chunk.length === 0) {
          this.push(null);
        } else {
          this.push(chunk);
        }
      }
    });
  }
}
