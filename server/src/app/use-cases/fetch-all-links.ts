import type { IFetchLinksOutput } from '@/@types/fetch-links-output';
import type { ILinksRepository } from '@/repositories/links.repository';
import type { Either } from '@/shared/either';

export class FetchAllLinksUseCase {
	constructor(private linksRepository: ILinksRepository) {}

	async execute(): Promise<Either<never, IFetchLinksOutput>> {
		const results = await this.linksRepository.fetchAllLinks();
		return results;
	}
}
