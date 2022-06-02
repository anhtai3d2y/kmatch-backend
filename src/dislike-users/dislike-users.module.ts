import { Module } from '@nestjs/common';
import { DislikeUsersService } from './dislike-users.service';
import { DislikeUsersController } from './dislike-users.controller';
import { dislikeUsersSchema } from './schemas/dislike-users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageErrorModule } from 'src/message-error/message-error.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DislikeUsers', schema: dislikeUsersSchema },
    ]),
    MessageErrorModule,
  ],
  controllers: [DislikeUsersController],
  providers: [DislikeUsersService, MessageErrorModule],
})
export class DislikeUsersModule {}
