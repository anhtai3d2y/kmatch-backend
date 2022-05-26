import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { UserController } from './users/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HeaderMiddleware } from 'common/middlewares/headers.middleware';
import { PaypalModule } from './paypal/paypal.module';
import { ThreadsModule } from './threads/threads.module';
import { MessagesModule } from './messages/messages.module';
import { InterestedGenderModule } from './interested-gender/interested-gender.module';
import { InterestedRelationModule } from './interested-relation/interested-relation.module';
import { PermissionModule } from './permission/permission.module';
import { GroupPermissionModule } from './group-permission/group-permission.module';
import { MatchesModule } from './matches/matches.module';
import { SuperLikeModule } from './super-like/super-like.module';
import { LikeUsersModule } from './like-users/like-users.module';
import { DislikeUsersModule } from './dislike-users/dislike-users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    AuthModule,
    UserModule,
    PaypalModule,
    ThreadsModule,
    MessagesModule,
    InterestedGenderModule,
    InterestedRelationModule,
    PermissionModule,
    GroupPermissionModule,
    MatchesModule,
    SuperLikeModule,
    LikeUsersModule,
    DislikeUsersModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(HeaderMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/signup', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },
      )
      .forRoutes({ path: 'user', method: RequestMethod.ALL });
  }
}
