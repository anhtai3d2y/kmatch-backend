import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { MessageErrorModule } from 'src/message-error/message-error.module';

@Module({
  imports: [MessageErrorModule],
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaypalModule {}
