import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
// import { LoggerMiddleware } from '../../common/middlewares/logger.middleware';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshTokenStrategy } from './strategy/jwtrefreshtoken.stragtegy';
import { MessageErrorModule } from 'src/message-error/message-error.module';
import { SendMailModule } from 'src/shared/send-mail/send-mail.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${config.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`,
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    MessageErrorModule,
    SendMailModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    MessageErrorModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(LoggerMiddleware)
    //   // .exclude(
    //   //   { path: 'example', method: RequestMethod.GET },
    //   // )
    //   .forRoutes(AuthController);
  }
}
