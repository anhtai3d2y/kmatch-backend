import {
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GCloudStorageService } from '../gcloud-storage.service';
import { GCloudStoragePerRequestOptions } from '../interfaces/gcloud-storage.interface';

export function GCloudStorageFilesInterceptor(
  localOptions?: MulterOptions,
  gcloudStorageOptions?: Partial<GCloudStoragePerRequestOptions>,
  filesMulterFieldsOptions?: any,
): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    public interceptor: NestInterceptor;
    constructor(private readonly gcloudStorage: GCloudStorageService) {
      this.interceptor = new (FileFieldsInterceptor(
        filesMulterFieldsOptions,
        localOptions,
      ))();
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      (await this.interceptor.intercept(context, next)) as Observable<any>;

      const request = await context.switchToHttp().getRequest();

      const files = request.files;
      const data: any = [];
      if (files) {
        for (const feildName of filesMulterFieldsOptions) {
          const feild = files[feildName.name];
          if (feild?.length) {
            if (feild[0].fieldname.includes('contentAnswer')) {
              gcloudStorageOptions = { prefix: 'contentAnswer' };
            } else if (feild[0].fieldname.includes('context')) {
              gcloudStorageOptions = { prefix: 'context' };
            } else {
              gcloudStorageOptions = { prefix: feild[0].fieldname };
            }
            feild[0].gcloudStorageOptions = gcloudStorageOptions;
            data.push(feild[0]);
          }
        }
        for (const file of data) {
          file.storageUrl = await this.gcloudStorage.upload(
            file,
            file.gcloudStorageOptions,
          );
        }
      }
      return next.handle().pipe(
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            // handle error
          }
          return throwError(error);
        }),
      );
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
