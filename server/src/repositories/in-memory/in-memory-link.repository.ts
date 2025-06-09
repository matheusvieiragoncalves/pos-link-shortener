import type { IFetchLinksOutput } from '@/@types/fetch-links-output';
import type { ICreateLinkInput, ILink } from '@/@types/link';

import { IFetchLinksPaginatedOutput } from '@/@types/fetch-links-output-paginated';
import { Readable } from 'node:stream';
import type { ILinksRepository } from '../links.repository';

export class InMemoryLinksRepository implements ILinksRepository {
  public items: ILink[] = [];

  createAutoIncrementId(): number {
    return this.items.length + 1;
  }

  async fetchAllLinks(): Promise<IFetchLinksOutput> {
    return {
      links: this.items,
      totalCount: this.items.length
    };
  }

  async fetchLinksPaginated(
    cursor = null,
    pageSize = 20,
    sortDirection: 'asc' | 'desc' = 'asc'
  ): Promise<IFetchLinksPaginatedOutput> {
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

    return { links, nextCursor };
  }

  async findByShortUrl(shortUrl: string): Promise<ILink | null> {
    const link = this.items.find((item) => item.shortUrl === shortUrl) ?? null;
    return link;
  }

  async create(data: ICreateLinkInput): Promise<ILink> {
    const { originalUrl, shortUrl } = data;

    const link: ILink = {
      id: this.items.length + 1,
      originalUrl,
      shortUrl,
      createdAt: new Date(),
      accessCount: 0
    };

    this.items.push(link);

    return link;
  }

  async incrementLinkAccessCountByShortUrl(
    shortUrl: string
  ): Promise<ILink | null> {
    const link = this.items.find((item) => item.shortUrl === shortUrl) ?? null;

    if (!link) return null;

    link.accessCount += 1;

    return link;
  }

  async deleteByShortUrl(shortUrl: string): Promise<null> {
    const index = this.items.findIndex((i) => i.shortUrl === shortUrl);

    if (index < 0) return null;

    this.items.splice(index, 1);

    return null;
  }

  getCursorToCSVExport(): Readable {
    let dataToExport = this.items.map((item) => ({
      short_url: item.shortUrl,
      original_url: item.originalUrl,
      access_count: item.accessCount,
      created_at: item.createdAt
    }));

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
