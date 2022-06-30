import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { LoggerMiddleware } from '../../common/middlewares/logger.middleware';
// import { GroupPermissionModule } from '../group-permission/group-permission.module';
import { userSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PagingService } from '../shared/handling-paging/paging.service';
import { SendMailService } from 'src/shared/send-mail/send-mail.service';
import { MessageErrorService } from 'src/message-error/message-error';
import { likeUsersSchema } from 'src/like-users/schemas/like-users.schema';
import { dislikeUsersSchema } from 'src/dislike-users/schemas/dislike-users.schema';
import { superlikeUsersSchema } from 'src/superlike-users/schemas/superlike-users.schema';
import { superlikeStarSchema } from 'src/superlike-star/schemas/superlike-star.schema.';
import { bootsSchema } from 'src/boots/schemas/boots.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'LikeUsers', schema: likeUsersSchema },
      { name: 'DislikeUsers', schema: dislikeUsersSchema },
      { name: 'SuperlikeUsers', schema: superlikeUsersSchema },
      { name: 'SuperlikeStar', schema: superlikeStarSchema },
      { name: 'Boots', schema: bootsSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, PagingService, SendMailService, MessageErrorService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
