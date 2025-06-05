import type { ILink } from '@/@types/link';
import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-link.repository';
import { isRight, unwrapEither } from '@/shared/either';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateLinkUseCase } from './create-links';
import { CustomUrlUnavailableError } from './errors/custom-url-unavailable.error';

let linksRepository: InMemoryLinksRepository;
let sut: CreateLinkUseCase;

describe('Create Links Use Case', () => {
	beforeEach(() => {
		linksRepository = new InMemoryLinksRepository();
		sut = new CreateLinkUseCase(linksRepository);
	});

	it('should to be able create a link successfully', async () => {
		const input: Pick<ILink, 'customUrl' | 'originalUrl'> = {
			customUrl: 'https://example.com',
			originalUrl: 'https://original-example.com',
		};

		const result = await sut.execute(input);

		expect(isRight(result)).toBeTruthy();
	});

	it('should not to be able create a link if custom url alredy exists', async () => {
		const sameCustomUrl = 'https://example.com/2';

		linksRepository.items.push({
			id: randomUUID(),
			customUrl: sameCustomUrl,
			originalUrl: 'https://original-example.com',
			createdAt: new Date(),
			accessCount: 0,
		});

		const input: Pick<ILink, 'customUrl' | 'originalUrl'> = {
			customUrl: sameCustomUrl,
			originalUrl: 'https://another-original-example.com',
		};

		const result = await sut.execute(input);

		expect(unwrapEither(result)).toBeInstanceOf(CustomUrlUnavailableError);
	});
});
