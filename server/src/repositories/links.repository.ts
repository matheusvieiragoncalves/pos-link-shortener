import type { ICreateLinkOutput } from '@/@types/create-link-output';
import type { IFetchLinksOutput } from '@/@types/fetch-links-output';
import type { IGetLinkOutput } from '@/@types/get-link-output';
import type { ICreateLinkInput } from '@/@types/link';
import type { CustomUrlUnavailableError } from '@/app/use-cases/errors/custom-url-unavailable.error';
import type { ResourceNotFoundError } from '@/app/use-cases/errors/resource-not-found.error';
import type { Either } from '@/shared/either';

export interface ILinksRepository {
	findByCustomUrl(
		customUrl: string
	): Promise<Either<never, IGetLinkOutput | null>>;

	fetchLinksPaginated(
		page?: number,
		pageSize?: number,
		sortDirection?: 'asc' | 'desc',
		sortBy?: 'createdAt'
	): Promise<Either<never, IFetchLinksOutput>>;

	fetchAllLinks(): Promise<Either<never, IFetchLinksOutput>>;

	create(
		data: ICreateLinkInput
	): Promise<Either<CustomUrlUnavailableError, ICreateLinkOutput>>;

	deleteLink(id: string): Promise<Either<Error, void>>;

	incrementLinkClickCountById(
		id: string
	): Promise<Either<ResourceNotFoundError, void>>;
}
