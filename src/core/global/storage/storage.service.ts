import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  _Object,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lookup as mimeLookup } from 'mime-types';
import { Readable } from 'stream';

import { AppConfig } from '@core/config';
import {
  Err,
  ExceptionErr,
  Ok,
  Res,
} from '@core/shared/common/common.neverthrow';

import { S3_STORAGE } from './storage.provider';
import { StorageOptions } from './storage.type';

@Injectable()
export class StorageService implements OnModuleInit {
  defaultBucket: string;
  enable: boolean;

  constructor(
    @Inject(S3_STORAGE)
    private s3: S3Client,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const storageConfig =
      this.configService.getOrThrow<AppConfig['storage']>('storage');

    this.defaultBucket = storageConfig.defaultBucket;
    this.enable = storageConfig.enable;

    await this._ensureBucket(this.defaultBucket);
  }

  async put(
    file: Express.Multer.File,
    key: string,
    opts?: StorageOptions,
  ): Promise<Res<null, 'failed' | 'disabled'>> {
    if (!this.enable) {
      return Err('disabled');
    }

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: opts?.bucket || this.defaultBucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return Ok(null);
    } catch (e: any) {
      return ExceptionErr('failed', e);
    }
  }

  async putBuffer(
    buffer: Buffer,
    key: string,
    opts?: StorageOptions,
  ): Promise<Res<null, 'failed' | 'disabled'>> {
    if (!this.enable) {
      return Err('disabled');
    }

    const contentType = mimeLookup(key) || 'application/octet-stream';

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: opts?.bucket || this.defaultBucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        }),
      );
      return Ok(null);
    } catch (e: any) {
      return ExceptionErr('failed', e);
    }
  }

  async get(
    key: string,
    opts?: StorageOptions,
  ): Promise<Res<Readable, 'failed' | 'disabled'>> {
    if (!this.enable) {
      return Err('disabled');
    }

    try {
      const res = await this.s3.send(
        new GetObjectCommand({
          Bucket: opts?.bucket || this.defaultBucket,
          Key: key,
        }),
      );

      return Ok(res.Body as Readable);
    } catch (e: any) {
      return ExceptionErr('failed', e);
    }
  }

  async getPresigned(
    key: string,
    opts?: StorageOptions & { expiresInSeconds?: number },
  ): Promise<Res<string, 'failed' | 'disabled'>> {
    if (!this.enable) {
      return Err('disabled');
    }

    const expiresIn = opts?.expiresInSeconds || 60 * 60 * 1; // default 1 hour

    try {
      const command = new GetObjectCommand({
        Bucket: opts?.bucket || this.defaultBucket,
        Key: key,
      });

      const presigned = await getSignedUrl(this.s3, command, { expiresIn });

      return Ok(presigned);
    } catch (e: any) {
      return ExceptionErr('failed', e);
    }
  }

  async remove(
    key: string,
    opts?: StorageOptions,
  ): Promise<Res<null, 'failed' | 'disabled'>> {
    if (!this.enable) {
      return Err('disabled');
    }

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: opts?.bucket || this.defaultBucket,
          Key: key,
        }),
      );
      return Ok(null);
    } catch (e: any) {
      return ExceptionErr('failed', e);
    }
  }

  async exists(key: string, opts?: StorageOptions): Promise<boolean> {
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: opts?.bucket || this.defaultBucket,
          Key: key,
        }),
      );
      return true;
    } catch {
      return false;
    }
  }

  async list(
    opts?: StorageOptions & { prefix?: string },
  ): Promise<Res<_Object[], 'failed' | 'disabled'>> {
    if (!this.enable) {
      return Err('disabled');
    }

    try {
      const res = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: opts?.bucket || this.defaultBucket,
          Prefix: opts?.prefix || '',
        }),
      );
      return Ok(res.Contents ?? []);
    } catch (e: any) {
      return ExceptionErr('failed', e);
    }
  }

  private async _ensureBucket(bucket: string): Promise<void> {
    if (!this.enable) {
      return;
    }

    try {
      await this.s3.send(new CreateBucketCommand({ Bucket: bucket }));
    } catch (e: any) {
      // 409 is already owned we ignore
      if (e?.$metadata?.httpStatusCode !== 409) throw e;
    }
  }
}
