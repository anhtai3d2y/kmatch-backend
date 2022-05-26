import { Module } from '@nestjs/common';
import { DislikeUsersService } from './dislike-users.service';
import { DislikeUsersController } from './dislike-users.controller';

@Module({
  controllers: [DislikeUsersController],
  providers: [DislikeUsersService]
})
export class DislikeUsersModule {}
