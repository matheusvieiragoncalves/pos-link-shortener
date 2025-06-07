import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-link.repository';
import { unwrapEither } from '@/shared/either';
import { makeLinksInMemory } from 'test/factories/make-links-in-memory';
import { ExportLinksUseCase } from './export-csv';

let linksRepository: InMemoryLinksRepository;
let sut: ExportLinksUseCase;

describe('Export Links', () => {
  beforeEach(() => {
    linksRepository = new InMemoryLinksRepository();
    sut = new ExportLinksUseCase(linksRepository);
  });

  it('should be able to export links', async () => {
    const link1 = makeLinksInMemory();
    const link2 = makeLinksInMemory();
    const link3 = makeLinksInMemory();
    const link4 = makeLinksInMemory();
    const link5 = makeLinksInMemory();

    linksRepository.items = [link1, link2, link3, link4, link5];

    const result = await sut.execute();

    const { generatedCSVStream } = unwrapEither(result);

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];

      generatedCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'));
      });

      generatedCSVStream.on('error', () => (error: Buffer) => {
        reject(error);
      });
    });

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map((row) => row.split(','));

    // console.log(csvAsArray);

    expect(csvAsArray).toEqual([
      ['ID', 'URL original', 'URL curta', 'Criado em', 'Quantidade de acessos'],
      [
        link1.id,
        link1.originalUrl,
        link1.shortUrl,
        expect.any(String),
        link1.accessCount.toString()
      ],
      [
        link2.id,
        link2.originalUrl,
        link2.shortUrl,
        expect.any(String),
        link2.accessCount.toString()
      ],
      [
        link3.id,
        link3.originalUrl,
        link3.shortUrl,
        expect.any(String),
        link3.accessCount.toString()
      ],
      [
        link4.id,
        link4.originalUrl,
        link4.shortUrl,
        expect.any(String),
        link4.accessCount.toString()
      ],
      [
        link5.id,
        link5.originalUrl,
        link5.shortUrl,
        expect.any(String),
        link5.accessCount.toString()
      ]
    ]);
  });
});
