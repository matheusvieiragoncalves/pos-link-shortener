import { env } from '@/env';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'node:crypto';
import { basename, extname } from 'node:path';
import { Readable } from 'node:stream';
import { z } from 'zod';
import { r2 } from './client';

const uploadFileToStorageInput = z.object({
  folder: z.enum(['reports']),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable)
});

type IUploadFileToStorageInput = z.infer<typeof uploadFileToStorageInput>;

export interface IUploadFileToStorageOutput {
  key: string;
  url: string;
}

export async function uploadFileToStorage(
  data: IUploadFileToStorageInput
): Promise<IUploadFileToStorageOutput> {
  const { folder, fileName, contentType, contentStream } =
    uploadFileToStorageInput.parse(data);

  const fileExtension = extname(fileName);
  const filenameWithoutExtension = basename(fileName);
  const sanitizedFileName = filenameWithoutExtension.replace(
    /[^a-zA-Z0-9]/g,
    ''
  );
  const sanitizedFileNameWithExtension = `${sanitizedFileName}${fileExtension}`;

  const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileNameWithExtension}`;

  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Body: contentStream,
      ContentType: contentType
    }
  });

  await upload.done();

  return {
    key: uniqueFileName,
    url: `${env.CLOUDFLARE_BUCKET_PUBLIC_URL}/${uniqueFileName}`
  };
}
