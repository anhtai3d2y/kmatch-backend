import { Module } from '@nestjs/common';
import { SuperlikeStarService } from './superlike-star.service';
import { SuperlikeStarController } from './superlike-star.controller';
import { superlikeStarSchema } from './schemas/superlike-star.schema.';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageErrorModule } from 'src/message-error/message-error.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SuperlikeStar', schema: superlikeStarSchema },
    ]),
    MessageErrorModule,
  ],
  controllers: [SuperlikeStarController],
  providers: [SuperlikeStarService],
})
export class SuperlikeStarModule {}
