import {
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GCloudStoragePerRequestOptions, GCloudStorageService } from '..';

export function GCloudStorageFileInterceptor(
  fieldName: string,
  localOptions?: MulterOptions,
  gcloudStorageOptions?: Partial<GCloudStoragePerRequestOptions>,
): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    public interceptor: NestInterceptor;

    constructor(private readonly gcloudStorage: GCloudStorageService) {
      this.interceptor = new (FileInterceptor(fieldName, localOptions))();
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      (await this.interceptor.intercept(context, next)) as Observable<any>;
      const request = context.switchToHttp().getRequest();
      const file = request['file'];
      if (file) {
        const storageUrl = await this.gcloudStorage.upload(
          file,
          gcloudStorageOptions,
        );
        file.storageUrl = storageUrl;
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
