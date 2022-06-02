import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsController } from './threads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { threadsSchema } from './schemas/threads.schema';
import { MessageErrorModule } from 'src/message-error/message-error.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Threads', schema: threadsSchema }]),
    MessageErrorModule,
  ],
  controllers: [ThreadsController],
  providers: [ThreadsService],
})
export class ThreadsModule {}
