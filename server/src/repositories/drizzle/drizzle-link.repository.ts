import type { IFetchLinksOutput } from '@/@types/fetch-links-output';

import { IFetchLinksPaginatedOutput } from '@/@types/fetch-links-output-paginated';
import { ICreateLinkInput, ILink } from '@/@types/link';
import { db, pg } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { asc, desc, eq, gt, ilike, lt, sql } from 'drizzle-orm';
import type { ILinksRepository } from '../links.repository';

export class DrizzleLinksRepository implements ILinksRepository {
  async fetchAllLinks(): Promise<IFetchLinksOutput> {
    const links = await db
      .select({
        id: schema.links.id,
        originalUrl: schema.links.originalUrl,
        shortUrl: schema.links.shortUrl,
        accessCount: schema.links.accessCount,
        createdAt: schema.links.createdAt
      })
      .from(schema.links);

    return { links, totalCount: links.length };
  }

  async findByShortUrl(shortUrl: string): Promise<ILink | null> {
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

    return link;
  }

  async fetchLinksPaginated(
    cursor?: number | null,
    pageSize: number = 20,
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<IFetchLinksPaginatedOutput> {
    const links = await db
      .select()
      .from(schema.links)
      .where(
        cursor
          ? sortDirection === 'desc'
            ? lt(schema.links.id, cursor)
            : gt(schema.links.id, cursor)
          : undefined
      )
      .orderBy(
        sortDirection === 'desc' ? desc(schema.links.id) : asc(schema.links.id)
      )

      .limit(pageSize);

    const nextCursor =
      links.length === pageSize ? links[links.length - 1].id : null;

    return {
      links,
      nextCursor
    };
  }

  async create(data: ICreateLinkInput): Promise<ILink> {
    const { originalUrl, shortUrl } = data;

    const result = await db
      .insert(schema.links)
      .values({
        shortUrl,
        originalUrl
      })
      .returning();

    const link = result[0] ?? null;

    return link;
  }

  async incrementLinkAccessCountByShortUrl(
    shortUrl: string
  ): Promise<ILink | null> {
    await db
      .update(schema.links)
      .set({ accessCount: sql`${schema.links.accessCount} + 1` })
      .where(eq(schema.links.shortUrl, shortUrl));

    const link = await db.query.links.findFirst({
      where: eq(schema.links.shortUrl, shortUrl)
    });

    return link ?? null;
  }

  async deleteByShortUrl(shortUrl: string): Promise<null> {
    await db.delete(schema.links).where(ilike(schema.links.shortUrl, shortUrl));
    return null;
  }

  async getCursorToCSVExport() {
    const { sql, params } = db
      .select({
        id: schema.links.id,
        originalUrl: schema.links.originalUrl,
        shortUrl: schema.links.shortUrl,
        accessCount: schema.links.accessCount,
        createdAt: schema.links.createdAt
      })
      .from(schema.links)
      .toSQL();

    const cursor = pg.unsafe(sql, params as string[]).cursor(10);

    return cursor;
  }
}
