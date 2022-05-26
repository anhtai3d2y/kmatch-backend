import { Module } from '@nestjs/common';
import { SuperLikeService } from './super-like.service';
import { SuperLikeController } from './super-like.controller';

@Module({
  controllers: [SuperLikeController],
  providers: [SuperLikeService]
})
export class SuperLikeModule {}
