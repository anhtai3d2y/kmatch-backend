import { Module } from '@nestjs/common';
import { BootsService } from './boots.service';
import { BootsController } from './boots.controller';
import { MessageErrorModule } from 'src/message-error/message-error.module';
import { MongooseModule } from '@nestjs/mongoose';
import { bootsSchema } from './schemas/boots.schema';
import { userSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Boots', schema: bootsSchema },
      { name: 'User', schema: userSchema },
    ]),
    MessageErrorModule,
  ],
  controllers: [BootsController],
  providers: [BootsService, MessageErrorModule],
})
export class BootsModule {}
