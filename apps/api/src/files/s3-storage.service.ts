import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type CreateUploadUrlInput = {
  key: string;
  contentType: string;
};

@Injectable()
export class S3StorageService {
  private readonly bucket: string;
  private readonly expiresIn: number;
  private readonly internalClient: S3Client;
  private readonly presignClient: S3Client;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.getOrThrow<string>('AWS_REGION');
    const endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');
    const publicEndpoint =
      this.configService.get<string>('AWS_S3_PUBLIC_ENDPOINT') || endpoint;
    const forcePathStyle = this.configService.getOrThrow<boolean>(
      'AWS_S3_FORCE_PATH_STYLE',
      {
        infer: true,
      },
    );

    this.bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET');
    this.expiresIn = this.configService.getOrThrow<number>(
      'S3_PRESIGNED_URL_EXPIRES_IN',
      {
        infer: true,
      },
    );
    const sharedConfig = {
      region,
      forcePathStyle,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    };

    this.internalClient = new S3Client({
      ...sharedConfig,
      endpoint: endpoint || undefined,
    });
    this.presignClient = new S3Client({
      ...sharedConfig,
      endpoint: publicEndpoint || undefined,
    });
  }

  createObjectKey(ownerId: string, originalName: string): string {
    const sanitizedName = sanitizeFileName(originalName);

    return `users/${ownerId}/${randomUUID()}-${sanitizedName}`;
  }

  async createUploadUrl({
    key,
    contentType,
  }: CreateUploadUrlInput): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.presignClient, command, {
      expiresIn: this.expiresIn,
    });
  }

  async getStoredObjectSize(key: string): Promise<number | null> {
    try {
      const response = await this.internalClient.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      return response.ContentLength ?? null;
    } catch (error) {
      if (isMissingObjectError(error)) {
        return null;
      }

      throw error;
    }
  }
}

function sanitizeFileName(name: string): string {
  const trimmedName = name.trim();
  const normalizedName = trimmedName.replaceAll(/\s+/g, '-').toLowerCase();
  const safeName = normalizedName.replaceAll(/[^a-z0-9._-]/g, '');

  return safeName || 'file';
}

function isMissingObjectError(error: unknown): boolean {
  if (error instanceof S3ServiceException) {
    return (
      error.name === 'NotFound' ||
      error.name === 'NoSuchKey' ||
      error.$metadata?.httpStatusCode === 404
    );
  }

  return false;
}
