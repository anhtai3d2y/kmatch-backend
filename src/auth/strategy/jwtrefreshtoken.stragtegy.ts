import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
// import { UserService } from '../../users/user.service';
import TokenPayload from '../interfaces/tokenPayload.interface';
import { UserService } from 'src/users/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    protected readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.body?.refreshToken;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request?.body?.refreshToken;
    if (!refreshToken || !payload?.userId) {
      throw new UnauthorizedException();
    }
    return await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload?.userId,
    );
  }
}
