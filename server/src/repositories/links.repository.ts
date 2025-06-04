import type { ICreateLinkInput, ILink } from '@/@types/link';
import type { Either } from '@/shared/either';

export interface ILinksRepository {
	create(data: ICreateLinkInput): Promise<Either<Error, ILink>>;
}
