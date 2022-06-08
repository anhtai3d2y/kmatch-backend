import { Injectable, Inject, Logger } from '@nestjs/common';
import { join } from 'path';
import {
  Storage,
  Bucket,
  CreateWriteStreamOptions,
  UploadOptions,
} from '@google-cloud/storage';
import { GCLOUD_STORAGE_MODULE_OPTIONS } from './constant/gcloud-storage.constant';
import {
  GCloudStorageOptions,
  GCloudStoragePerRequestOptions,
} from './interfaces/gcloud-storage.interface';
import { uuid } from '../../utils/util';
import * as path from 'path';
export interface UploadedFileMetadata {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: string;
  storageUrl?: string;
}

@Injectable()
export class GCloudStorageService {
  private readonly logger = new Logger(GCloudStorageService.name);
  public storage: Storage = new Storage();
  public bucket: Bucket = null;

  constructor(
    @Inject(GCLOUD_STORAGE_MODULE_OPTIONS)
    private readonly options: GCloudStorageOptions,
  ) {
    this.logger.log(`GCloudStorageService.options ${options}`);

    const bucketName = this.options.defaultBucketname;
    this.bucket = this.storage.bucket(bucketName);
  }

  async upload(
    fileMetadata: UploadedFileMetadata,
    perRequestOptions: Partial<GCloudStoragePerRequestOptions> = null,
  ): Promise<string> {
    const filename: any = uuid();
    const gcFilename =
      perRequestOptions && perRequestOptions.prefix
        ? join(perRequestOptions.prefix, filename)
        : filename;
    const gcFile = this.bucket.file(gcFilename);

    // override global options with the provided ones for this request
    perRequestOptions = {
      ...this.options,
      ...perRequestOptions,
    };

    const writeStreamOptions =
      perRequestOptions && perRequestOptions.writeStreamOptions;

    const { predefinedAcl = 'private' } = perRequestOptions;
    const streamOpts: CreateWriteStreamOptions = {
      predefinedAcl: predefinedAcl,
      ...writeStreamOptions,
    };

    const contentType = fileMetadata.mimetype;
    if (contentType) {
      streamOpts.metadata = { contentType };
    }
    return new Promise((resolve, reject) => {
      gcFile
        .createWriteStream(streamOpts)
        .on('error', (error) => reject(error))
        .on('finish', () => resolve(this.getStorageUrl(gcFilename)))
        .end(fileMetadata.buffer);
    });
  }

  getStorageUrl(filename: string) {
    return join(filename);
  }

  async deleteFiles(files: []) {
    for (const file of files) {
      try {
        await this.bucket.file(file).delete();
      } catch (e) {
        console.error('file not found');
      }
    }
  }

  async deleteFile(file) {
    try {
      await this.bucket.file(file).delete();
    } catch (e) {
      console.error('file not found');
    }
  }

  async uploadLocalFile(localFilePath, options: UploadOptions) {
    options = options || {};
    return await this.bucket.upload(localFilePath, options);
    // .then(() => file.makePublic());
  }

  async getGoogleObjects(options) {
    const [files] = await this.bucket.getFiles(options);
    return files;
  }
}
