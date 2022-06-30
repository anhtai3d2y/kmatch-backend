import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { MessageErrorModule } from 'src/message-error/message-error.module';
import { MongooseModule } from '@nestjs/mongoose';
import { paypalSchema } from './schemas/paypal.schema';
import { userSchema } from 'src/users/schemas/user.schema';
import { superlikeStarSchema } from 'src/superlike-star/schemas/superlike-star.schema.';
import { bootsSchema } from 'src/boots/schemas/boots.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Paypal', schema: paypalSchema },
      { name: 'User', schema: userSchema },
      { name: 'SuperlikeStar', schema: superlikeStarSchema },
      { name: 'Boots', schema: bootsSchema },
    ]),
    MessageErrorModule,
  ],
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaypalModule {}
