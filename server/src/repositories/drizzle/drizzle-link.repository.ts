import type { IFetchLinksOutput } from '@/@types/fetch-links-output';

import { ICreateLinkOutput } from '@/@types/create-link-output';
import { IFetchLinksPaginatedOutput } from '@/@types/fetch-links-output-paginated';
import { IGetLinkOutput } from '@/@types/get-link-output';
import { ICreateLinkInput } from '@/@types/link';
import { ResourceNotFoundError } from '@/app/use-cases/errors/resource-not-found.error';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { ilike } from 'drizzle-orm';
import { Readable } from 'stream';
import type { ILinksRepository } from '../links.repository';

export class DrizzleLinksRepository implements ILinksRepository {
  async fetchAllLinks(): Promise<Either<never, IFetchLinksOutput>> {
    const links = await db
      .select({
        id: schema.links.id,
        originalUrl: schema.links.originalUrl,
        shortUrl: schema.links.shortUrl,
        accessCount: schema.links.accessCount,
        createdAt: schema.links.createdAt
      })
      .from(schema.links);

    return makeRight({ links, totalCount: links.length });
  }

  async findByShortUrl(
    shortUrl: string
  ): Promise<Either<ResourceNotFoundError, IGetLinkOutput>> {
    const result = await db
      .select({
        id: schema.links.id,
        originalUrl: schema.links.originalUrl,
        shortUrl: schema.links.shortUrl,
        accessCount: schema.links.accessCount,
        createdAt: schema.links.createdAt
      })
      .from(schema.links)
      .where(ilike(schema.links.shortUrl, shortUrl))
      .limit(1);

    const link = result[0] ?? null;

    if (!link) return makeLeft(new ResourceNotFoundError());

    return makeRight({ link });
  }

  fetchLinksPaginated(
    cursor?: number | null,
    pageSize?: number,
    sortDirection?: 'asc' | 'desc'
  ): Promise<Either<never, IFetchLinksPaginatedOutput>> {
    throw new Error('Method not implemented.');
  }

  async create(
    data: ICreateLinkInput
  ): Promise<Either<never, ICreateLinkOutput>> {
    const { originalUrl, shortUrl } = data;

    const result = await db
      .insert(schema.links)
      .values({
        shortUrl,
        originalUrl
      })
      .returning();

    const link = result[0] ?? null;

    return makeRight({ link });
  }

  incrementLinkAccessCountByShortUrl(
    shortUrl: string
  ): Promise<Either<ResourceNotFoundError, null>> {
    throw new Error('Method not implemented.');
  }

  deleteByShortUrl(shortUrl: string): Promise<Either<never, null>> {
    throw new Error('Method not implemented.');
  }

  getCursorToCSVExport(): Readable {
    throw new Error('Method not implemented.');
  }
}
