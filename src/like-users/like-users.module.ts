import { Module } from '@nestjs/common';
import { LikeUsersService } from './like-users.service';
import { LikeUsersController } from './like-users.controller';
import { likeUsersSchema } from './schemas/like-users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageErrorModule } from 'src/message-error/message-error.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'LikeUsers', schema: likeUsersSchema }]),
    MessageErrorModule,
  ],
  controllers: [LikeUsersController],
  providers: [LikeUsersService],
})
export class LikeUsersModule {}
