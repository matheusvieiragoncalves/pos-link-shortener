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
        { key: 'id', header: 'ID' },
        { key: 'originalUrl', header: 'URL original' },
        { key: 'shortUrl', header: 'URL curta' },
        { key: 'createdAt', header: 'Criado em' },
        { key: 'accessCount', header: 'Quantidade de acessos' }
      ]
    });

    const stream = new PassThrough();

    await pipeline(
      cursor,
      new Transform({
        objectMode: true,
        transform(chunks: unknown[], _, cb) {
          for (const chunk of chunks) {
            this.push(chunk);
          }
          cb();
        }
      }),
      csv,
      stream
    );

    return makeRight({ generatedCSVStream: stream });
  }
}
