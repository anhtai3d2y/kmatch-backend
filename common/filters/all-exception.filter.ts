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
        const message = 'Forbidden Resource';
        response.status(statusCode).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: message ?? 'A system error has occurred!',
          error: 'Unprocessable Entity',
        });
      } else {
        response.status(statusCode).json(exception.getResponse());
      }
    } else {
      let message = exception.getResponse() as {
        key: string;
        args: Record<string, any>;
      };

      response.status(statusCode).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: message ?? 'A system error has occurred!',
        error: 'Unprocessable Entity',
      });
    }
  }
}
