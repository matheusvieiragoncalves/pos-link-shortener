import type { IGetLinkOutput } from '@/@types/get-link-output';
import type { ILinksRepository } from '@/repositories/links.repository';
import { type Either, isLeft, makeRight, unwrapEither } from '@/shared/either';
import { z } from 'zod';
import type { ResourceNotFoundError } from './errors/resource-not-found.error';

const getLinkByCustomUrlSchema = z.object({
	customUrl: z.string().url(),
});

type IGetLinkByCustomUrlInput = z.infer<typeof getLinkByCustomUrlSchema>;

export class GetLinkByCustomUrlUseCase {
	constructor(private linksRepository: ILinksRepository) {}

	async execute(
		data: IGetLinkByCustomUrlInput
	): Promise<Either<ResourceNotFoundError, IGetLinkOutput | null>> {
		console.log('chamou');

		const { customUrl } = getLinkByCustomUrlSchema.parse(data);

		const result = await this.linksRepository.findByCustomUrl(customUrl);

		if (isLeft(result)) {
			return result;
		}

		const existingLink = unwrapEither(result);

		if (!existingLink) {
			return makeRight(null);
		}

		const incrementResult =
			await this.linksRepository.incrementLinkClickCountById(
				existingLink.link.id
			);

		if (isLeft(incrementResult)) {
			return incrementResult;
		}

		const { link } = existingLink;

		return makeRight({ link: { ...link, accessCount: link.accessCount + 1 } });
	}
}
