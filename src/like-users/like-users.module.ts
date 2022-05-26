import { Module } from '@nestjs/common';
import { LikeUsersService } from './like-users.service';
import { LikeUsersController } from './like-users.controller';

@Module({
  controllers: [LikeUsersController],
  providers: [LikeUsersService]
})
export class LikeUsersModule {}
