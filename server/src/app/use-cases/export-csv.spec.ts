import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as upload from '@/infra/storage/upload-file-to-storage';
import { InMemoryLinksRepository } from '@/repositories/in-memory/in-memory-link.repository';
import { unwrapEither } from '@/shared/either';
import { randomUUID } from 'crypto';
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
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'http://example.com/file.csv'
        };
      });

    const link1 = makeLinksInMemory({
      id: 1
    });
    const link2 = makeLinksInMemory({
      id: 2
    });
    const link3 = makeLinksInMemory({
      id: 3
    });
    const link4 = makeLinksInMemory({
      id: 4
    });
    const link5 = makeLinksInMemory({
      id: 5
    });

    linksRepository.items = [link1, link2, link3, link4, link5];

    const result = await sut.execute();

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream;

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

    expect(csvAsArray).toEqual([
      ['URL curta', 'URL original', 'Quantidade de acessos', 'Criado em'],
      [
        link1.shortUrl,
        link1.originalUrl,
        link1.accessCount.toString(),
        expect.any(String)
      ],
      [
        link2.shortUrl,
        link2.originalUrl,
        link2.accessCount.toString(),
        expect.any(String)
      ],
      [
        link3.shortUrl,
        link3.originalUrl,
        link3.accessCount.toString(),
        expect.any(String)
      ],
      [
        link4.shortUrl,
        link4.originalUrl,
        link4.accessCount.toString(),
        expect.any(String)
      ],
      [
        link5.shortUrl,
        link5.originalUrl,
        link5.accessCount.toString(),
        expect.any(String)
      ]
    ]);

    expect(unwrapEither(result)).toEqual({
      url: 'http://example.com/file.csv'
    });
  });
});
