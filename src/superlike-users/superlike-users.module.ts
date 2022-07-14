import { Module } from '@nestjs/common';
import { SuperlikeUsersService } from './superlike-users.service';
import { SuperlikeUsersController } from './superlike-users.controller';
import { superlikeUsersSchema } from './schemas/superlike-users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageErrorModule } from 'src/message-error/message-error.module';
import { superlikeStarSchema } from 'src/superlike-star/schemas/superlike-star.schema.';
import { likeUsersSchema } from 'src/like-users/schemas/like-users.schema';
import { matchesSchema } from 'src/matches/schemas/matches.schema';
import { userSchema } from 'src/users/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SuperlikeUsers', schema: superlikeUsersSchema },
      { name: 'LikeUsers', schema: likeUsersSchema },
      { name: 'SuperlikeStar', schema: superlikeStarSchema },
      { name: 'Matches', schema: matchesSchema },
      { name: 'User', schema: userSchema },
    ]),
    MessageErrorModule,
  ],
  controllers: [SuperlikeUsersController],
  providers: [SuperlikeUsersService],
})
export class SuperlikeUsersModule {}
