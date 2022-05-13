import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    return response
      .status(exception.getStatus())
      .json(await this.getMessage(exception, ctx.getRequest().i18nLang));
  }

  async getMessage(exception: HttpException, lang: string) {
    const exceptionResponse = exception.getResponse() as any;
    if (exceptionResponse.hasOwnProperty('message')) {
      if (exceptionResponse.message instanceof Array) {
        exceptionResponse.message = await this.translateArray(
          exceptionResponse.message,
          lang,
        );
      } else if (typeof exceptionResponse.message === 'string') {
        exceptionResponse.message = await this.i18n.translate(
          exceptionResponse.message,
          { lang: lang },
        );
      }
    }
    return exceptionResponse;
  }

  async translateArray(errors: any[], lang: string) {
    const data = [];
    for (let i = 0; i < errors.length; i++) {
      const item = errors[i];
      if (typeof item === 'string') {
        data.push(
          await this.i18n.translate(`validation.${item}`, { lang: lang }),
        );
        continue;
      } else if (item instanceof ValidationError) {
        const message = await Promise.all(
          Object.values(item.constraints).map(
            async (value: string) =>
              await this.i18n.translate(`validation.${value}`, { lang: lang }),
          ),
        );
        data.push({ field: item.property, message: message });
        continue;
      }
      data.push(item);
    }
    return data;
  }
}
