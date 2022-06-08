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

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  controllers: [UserController],
  providers: [UserService, PagingService, SendMailService, MessageErrorService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
