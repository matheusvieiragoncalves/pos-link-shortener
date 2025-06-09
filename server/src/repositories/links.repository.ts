import type { IFetchLinksOutput } from '@/@types/fetch-links-output';
import { IFetchLinksPaginatedOutput } from '@/@types/fetch-links-output-paginated';
import type { ICreateLinkInput, ILink } from '@/@types/link';

export interface ILinksRepository {
  findByShortUrl(shortUrl: string): Promise<ILink | null>;

  fetchLinksPaginated(
    cursor?: number | null,
    pageSize?: number,
    sortDirection?: 'asc' | 'desc'
  ): Promise<IFetchLinksPaginatedOutput>;

  fetchAllLinks(): Promise<IFetchLinksOutput>;

  create(data: ICreateLinkInput): Promise<ILink>;

  incrementLinkAccessCountByShortUrl(shortUrl: string): Promise<ILink | null>;

  deleteByShortUrl(shortUrl: string): Promise<null>;

  getCursorToCSVExport(): any;
}
