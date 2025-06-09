import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage';
import type { ILinksRepository } from '@/repositories/links.repository';
import { Either, makeRight } from '@/shared/either';
import { stringify } from 'csv-stringify';
import { PassThrough, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export class ExportLinksUseCase {
  constructor(private linksRepository: ILinksRepository) {}

  async execute(): Promise<Either<never, any>> {
    const cursor = await this.linksRepository.getCursorToCSVExport();

    const csv = stringify({
      header: true,
      columns: [
        { key: 'short_url', header: 'URL curta' },
        { key: 'original_url', header: 'URL original' },
        { key: 'access_count', header: 'Quantidade de acessos' },
        { key: 'created_at', header: 'Criado em' }
      ]
    });

    const stream = new PassThrough();

    const convertToCSVPipeline = await pipeline(
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

    const uploadToStorage = uploadFileToStorage({
      contentType: 'text/csv',
      folder: 'reports',
      fileName: `${new Date().toISOString()}-uploads.csv`,
      contentStream: stream
    });

    const [{ url }] = await Promise.all([
      uploadToStorage,
      convertToCSVPipeline
    ]);

    return makeRight({ url });
  }
}
