import type { ILinksRepository } from '@/repositories/links.repository';
import { Either, makeRight } from '@/shared/either';
import { stringify } from 'csv-stringify';
import { PassThrough, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export class ExportLinksUseCase {
  constructor(private linksRepository: ILinksRepository) {}

  async execute(): Promise<Either<never, any>> {
    const cursor = this.linksRepository.getCursorToCSVExport();

    const csv = stringify({
      header: true,
      columns: [
        { key: 'originalUrl', header: 'URL original' },
        { key: 'shortUrl', header: 'URL curta' },
        { key: 'accessCount', header: 'Quantidade de acessos' },
        { key: 'createdAt', header: 'Criado em' }
      ]
    });

    const stream = new PassThrough();

    await pipeline(
      cursor,
      new Transform({
        objectMode: true,
        transform(chunks: unknown[], _, callback) {
          for (const chunk of chunks) {
            this.push(chunk);
          }
          callback();
        }
      }),
      csv,
      stream
    );

    return makeRight({ generatedCSVStream: stream });
  }
}
