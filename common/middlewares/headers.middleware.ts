import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { UserService } from '../../src/users/user.service';
import { AuthService } from '../../src/auth/auth.service';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<any> {
    let decoded: any;
    const token = req.headers?.authorization?.replace('Bearer ', '');

    if (token) {
      try {
        decoded = jwt.verify(
          token,
          this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        );
        next();
      } catch (e) {
        let error: any;
        if (e.name === 'JsonWebTokenError') {
          if (e.message === 'jwt must be provided') {
            error = {
              statusCode: HttpStatus.UNAUTHORIZED,
              error: 'Unauthorized',
              message: 'Token is required!',
            };
          } else if (e.message === 'jwt malformed') {
            error = {
              statusCode: HttpStatus.UNAUTHORIZED,
              error: 'Unauthorized',
              message: 'Token is not valid!',
            };
          }
        } else if (e.name === 'TokenExpiredError') {
          error = {
            statusCode: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized',
            message: 'Token is expired!',
          };
        } else {
          error = {
            statusCode: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized',
            message: 'Unauthorized access',
          };
        }
        return res.status(HttpStatus.FORBIDDEN).json(error);
      }
    } else {
      const error = {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: 'Unauthorized access',
      };
      return res.status(HttpStatus.FORBIDDEN).json(error);
    }
  }
}
