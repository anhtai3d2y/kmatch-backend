import { Injectable } from '@nestjs/common';
import { GCloudStorageService } from './gcloud-storage.service';

/**
 * @todo This service is not working with the Multer API. Figure out why!
 */
@Injectable()
export class GCloudMulterStorageService {
  constructor(private readonly gcsStorage: GCloudStorageService) {}

  // @implement multer.storage
  // eslint-disable-next-line @typescript-eslint/ban-types
  async _handleFile(_req: any, file: any, cb: Function) {
    const storageUrl = await this.gcsStorage.upload(file);
    file.storageUrl = storageUrl;

    cb(null, {
      file,
    });
  }

  // @implement multer.storage
  // eslint-disable-next-line @typescript-eslint/ban-types
  _removeFile(_req: any, file: any, cb: Function) {
    delete file.buffer;
    cb(null);
  }
}
