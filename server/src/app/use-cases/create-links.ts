import type { ICreateLinkOutput } from '@/@types/create-link-output';
import type { ILinksRepository } from '@/repositories/links.repository';
import type { Either } from '@/shared/either';
import { isLeft, makeLeft, unwrapEither } from '@/shared/either';
import { z } from 'zod';
import { CustomUrlUnavailableError } from './errors/custom-url-unavailable.error';

const createLinkSchema = z.object({
	originalUrl: z.string().url(),
	customUrl: z.string().url(),
});

type ICreateLinkInput = z.infer<typeof createLinkSchema>;

export class CreateLinkUseCase {
	constructor(private linksRepository: ILinksRepository) {}

	async execute(
		data: ICreateLinkInput
	): Promise<Either<CustomUrlUnavailableError, ICreateLinkOutput>> {
		const { customUrl, originalUrl } = createLinkSchema.parse(data);

		const existingLink = await this.linksRepository.findByCustomUrl(customUrl);

		if (unwrapEither(existingLink)) {
			return makeLeft(new CustomUrlUnavailableError());
		}

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
