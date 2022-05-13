import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { GroupPermissionService } from '../../group-permission/group-permission.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    // private groupPermissionService: GroupPermissionService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const per = await this.groupPermissionService.getPermissionsByRoleV2(
      user.role,
    );
    user.permission = per;
    return user;
  }
}
