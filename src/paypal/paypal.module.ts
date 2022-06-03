import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { MessageErrorModule } from 'src/message-error/message-error.module';
import { MongooseModule } from '@nestjs/mongoose';
import { paypalSchema } from './schemas/messages.schema';
import { userSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Paypal', schema: paypalSchema },
      { name: 'User', schema: userSchema },
    ]),
    MessageErrorModule,
  ],
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaypalModule {}
