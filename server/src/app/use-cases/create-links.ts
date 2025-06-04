import type { ILinksRepository } from '@/repositories/links.repository';
import type { Either } from '@/shared/either';
import { isLeft } from '@/shared/either';
import { z } from 'zod';

const createLinkSchema = z.object({
	originalUrl: z.string().url(),
	customUrl: z.string().url(),
});

type ICreateLinkInput = z.infer<typeof createLinkSchema>;

interface ICreateLinkOutput {
	id: string;
	originalUrl: string;
	customUrl: string;
	createdAt: Date;
}

export class CreateLinkUseCase {
	constructor(private linksRepository: ILinksRepository) {}

	async execute(
		data: ICreateLinkInput
	): Promise<Either<Error, ICreateLinkOutput>> {
		const { customUrl, originalUrl } = createLinkSchema.parse(data);

		// Todo: add logic to check if the custom URL already exists in the database

		const result = await this.linksRepository.create({
			customUrl,
			originalUrl,
		});

		if (isLeft(result)) {
			return result;
		}

		return result;
	}
}
