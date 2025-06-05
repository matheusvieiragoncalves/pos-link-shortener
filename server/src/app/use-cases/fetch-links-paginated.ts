import type { IFetchLinksOutput } from '@/@types/fetch-links-output';
import type { ILinksRepository } from '@/repositories/links.repository';
import type { Either } from '@/shared/either';
import { z } from 'zod';

const fetchLinksPaginatedSchema = z.object({
	sortBy: z.enum(['createdAt']).optional(),
	sortDirection: z.enum(['asc', 'desc']).optional().default('desc'),
	page: z.number().optional().default(1),
	pageSize: z.number().optional().default(20),
});

type IFetchLinksPaginatedInput = z.input<typeof fetchLinksPaginatedSchema>;

export class FetchLinksPaginatedUseCase {
	constructor(private linksRepository: ILinksRepository) {}

	async execute(
		data: IFetchLinksPaginatedInput
	): Promise<Either<never, IFetchLinksOutput>> {
		const { page, pageSize, sortDirection, sortBy } =
			fetchLinksPaginatedSchema.parse(data);

		const results = await this.linksRepository.fetchLinksPaginated(
			page,
			pageSize,
			sortDirection,
			sortBy
		);

		return results;
	}
}
