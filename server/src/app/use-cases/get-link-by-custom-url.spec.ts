import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-link.repository';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { makeLinksInMemory } from 'test/factories/make-links-in-memory';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetLinkByCustomUrlUseCase } from './get-link-by-custom-url';

let linksRepository: InMemoryLinksRepository;
let sut: GetLinkByCustomUrlUseCase;

describe('Create Links Use Case', () => {
	beforeEach(() => {
		linksRepository = new InMemoryLinksRepository();
		sut = new GetLinkByCustomUrlUseCase(linksRepository);
	});

	it('should to be able get link by custom url', async () => {
		const link = makeLinksInMemory();

		linksRepository.items.push(link);

		const result = await sut.execute({
			customUrl: link.customUrl,
		});

		expect(isRight(result)).toBeTruthy();
	});

	it('should not to be able get link by custom url if not exists', async () => {
		const result = await sut.execute({
			customUrl: 'https://non-existing-url.com',
		});

		expect(unwrapEither(result)).toBeNull();
	});

	it('should be able to increment the link access counter whenever it is clicked', async () => {
		const newLink = makeLinksInMemory();
		linksRepository.items.push({ ...newLink });

		const getResult = await sut.execute({
			customUrl: newLink.customUrl,
		});

		expect(isRight(getResult)).toBeTruthy();

		if (isLeft(getResult)) {
			return;
		}

		const { link } = unwrapEither(getResult);

		expect(link.accessCount).toBe(newLink.accessCount + 1);
	});
});
