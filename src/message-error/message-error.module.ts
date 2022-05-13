import { Module } from '@nestjs/common';
import { MessageErrorService } from './message-error';

@Module({
  exports: [MessageErrorService],
  providers: [MessageErrorService],
})
export class MessageErrorModule {}
