import { Module } from '@nestjs/common';
import { BootsService } from './boots.service';
import { BootsController } from './boots.controller';
import { MessageErrorModule } from 'src/message-error/message-error.module';
import { MongooseModule } from '@nestjs/mongoose';
import { bootsSchema } from './schemas/boots.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Boots', schema: bootsSchema }]),
    MessageErrorModule,
  ],
  controllers: [BootsController],
  providers: [BootsService, MessageErrorModule],
})
export class BootsModule {}
