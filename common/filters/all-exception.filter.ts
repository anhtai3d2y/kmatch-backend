import { I18nService } from 'nestjs-i18n';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    if (
      typeof JSON.parse(JSON.stringify(exception.getResponse())).message ==
        'string' ||
      Array.isArray(JSON.parse(JSON.stringify(exception.getResponse())).message)
    ) {
      if (
        JSON.parse(JSON.stringify(exception.getResponse())).message ===
        'Forbidden resource'
      ) {
        const message = await this.i18n.translate(
          `validation.Forbidden_resource`,
          {
            lang: ctx.getRequest().i18nLang,
          },
        );
        response.status(statusCode).json({
          statusCode: HttpStatus.FORBIDDEN,
          message:
            message ??
            (await this.i18n.translate('common.SYSTEM_ERROR'),
            {
              lang: ctx.getRequest().i18nLang,
            }),
          error: await this.i18n.translate('validation.UNPROCESSABLE_ENTITY', {
            lang: ctx.getRequest().i18nLang,
          }),
        });
      } else {
        response.status(statusCode).json(exception.getResponse());
      }
    } else {
      let message = exception.getResponse() as {
        key: string;
        args: Record<string, any>;
      };

      message = await this.i18n.translate(message.key, {
        lang: ctx.getRequest().i18nLang,
        args: message.args,
      });

      response.status(statusCode).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message:
          message ??
          (await this.i18n.translate('common.SYSTEM_ERROR'),
          {
            lang: ctx.getRequest().i18nLang,
          }),
        error: await this.i18n.translate('validation.UNPROCESSABLE_ENTITY', {
          lang: ctx.getRequest().i18nLang,
        }),
      });
    }
  }
}
