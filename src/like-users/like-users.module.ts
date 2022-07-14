import { Module } from '@nestjs/common';
import { LikeUsersService } from './like-users.service';
import { LikeUsersController } from './like-users.controller';
import { likeUsersSchema } from './schemas/like-users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageErrorModule } from 'src/message-error/message-error.module';
import { superlikeUsersSchema } from 'src/superlike-users/schemas/superlike-users.schema';
import { matchesSchema } from 'src/matches/schemas/matches.schema';
import { userSchema } from 'src/users/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LikeUsers', schema: likeUsersSchema },
      { name: 'SuperlikeUsers', schema: superlikeUsersSchema },
      { name: 'Matches', schema: matchesSchema },
      { name: 'User', schema: userSchema },
    ]),
    MessageErrorModule,
  ],
  controllers: [LikeUsersController],
  providers: [LikeUsersService],
})
export class LikeUsersModule {}
