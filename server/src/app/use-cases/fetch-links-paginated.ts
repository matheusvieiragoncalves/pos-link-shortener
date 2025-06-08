import { IFetchLinksPaginatedOutput } from '@/@types/fetch-links-output-paginated';
import type { ILinksRepository } from '@/repositories/links.repository';
import { makeRight, type Either } from '@/shared/either';
import { z } from 'zod';

const fetchLinksPaginatedSchema = z.object({
  cursor: z.number().optional(),
  pageSize: z.number().optional().default(20),
  sortDirection: z.enum(['asc', 'desc']).optional().default('desc')
});

type IFetchLinksPaginatedInput = z.input<typeof fetchLinksPaginatedSchema>;

export class FetchLinksPaginatedUseCase {
  constructor(private linksRepository: ILinksRepository) {}

  async execute(
    data: IFetchLinksPaginatedInput
  ): Promise<Either<never, IFetchLinksPaginatedOutput>> {
    const { cursor, pageSize, sortDirection } =
      fetchLinksPaginatedSchema.parse(data);

    const results = await this.linksRepository.fetchLinksPaginated(
      cursor,
      pageSize,
      sortDirection
    );

    return makeRight(results);
  }
}
