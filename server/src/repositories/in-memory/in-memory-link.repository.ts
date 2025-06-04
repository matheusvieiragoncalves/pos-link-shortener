import type { ICreateLinkInput, ILink } from '@/@types/link';

import { type Either, makeLeft, makeRight } from '@/shared/either';
import { randomUUID } from 'node:crypto';
import type { ILinksRepository } from '../links.repository';

export class InMemoryLinksRepository implements ILinksRepository {
	public items: ILink[] = [];

	async create(data: ICreateLinkInput): Promise<Either<Error, ILink>> {
		try {
			const { originalUrl, customUrl } = data;

			const link: ILink = {
				id: randomUUID(),
				originalUrl,
				customUrl,
				createdAt: new Date(),
			};

			const urlAlredyExists = this.items.some(
				(item) => item.customUrl === customUrl
			);

			// Check if the custom URL already exists in the repository - simulating a database unique constraint
			if (urlAlredyExists) {
				return makeLeft(new Error('Custom URL already exists'));
			}

			this.items.push(link);

			return makeRight(link);
		} catch (error) {
			return makeLeft(new Error('Failed to create link'));
		}
	}
}
