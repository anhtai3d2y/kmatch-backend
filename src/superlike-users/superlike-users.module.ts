import { Module } from '@nestjs/common';
import { SuperlikeUsersService } from './superlike-users.service';
import { SuperlikeUsersController } from './superlike-users.controller';
import { superlikeUsersSchema } from './schemas/superlike-users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageErrorModule } from 'src/message-error/message-error.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SuperlikeUsers', schema: superlikeUsersSchema },
    ]),
    MessageErrorModule,
  ],
  controllers: [SuperlikeUsersController],
  providers: [SuperlikeUsersService],
})
export class SuperlikeUsersModule {}
