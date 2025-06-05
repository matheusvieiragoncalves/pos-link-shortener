import type { ICreateLinkOutput } from '@/@types/create-link-output';

import type { IFetchLinksOutput } from '@/@types/fetch-links-output';
import type { IGetLinkOutput } from '@/@types/get-link-output';
import type { ICreateLinkInput, ILink } from '@/@types/link';
import { CustomUrlUnavailableError } from '@/app/use-cases/errors/custom-url-unavailable.error';
import { ResourceNotFoundError } from '@/app/use-cases/errors/resource-not-found.error';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { randomUUID } from 'node:crypto';
import type { ILinksRepository } from '../links.repository';

export class InMemoryLinksRepository implements ILinksRepository {
	public items: ILink[] = [];

	async fetchAllLinks(): Promise<Either<never, IFetchLinksOutput>> {
		return makeRight({
			links: this.items,
			totalCount: this.items.length,
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

	async findByCustomUrl(
		customUrl: string
	): Promise<Either<never, IGetLinkOutput | null>> {
		const link = this.items.find((item) => item.customUrl === customUrl);

		if (!link) {
			return makeRight(null);
		}

		return makeRight({ link: { ...link } });
	}

	async create(
		data: ICreateLinkInput
	): Promise<Either<Error, ICreateLinkOutput>> {
		const { originalUrl, customUrl } = data;

		const link: ILink = {
			id: randomUUID(),
			originalUrl,
			customUrl,
			createdAt: new Date(),
			accessCount: 0,
		};

		const urlAlredyExists = this.items.some(
			(item) => item.customUrl === customUrl
		);

		// Check if the custom URL already exists in the repository - simulating a database unique constraint
		if (urlAlredyExists) {
			return makeLeft(new CustomUrlUnavailableError());
		}

		this.items.push(link);

		return makeRight({ link });
	}

	async incrementLinkClickCountById(
		id: string
	): Promise<Either<ResourceNotFoundError, void>> {
		const link = this.items.find((item) => item.id === id);

		if (!link) {
			return makeLeft(new ResourceNotFoundError());
		}

		link.accessCount += 1;

		return makeRight(undefined);
	}

	async deleteLink(id: string): Promise<Either<Error, void>> {
		this.items = this.items.filter((item) => item.id !== id);
		return makeRight(undefined);
	}
}
