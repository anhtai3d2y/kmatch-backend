import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { verificationSchema } from './schemas/vetification.schema';
import { MessageErrorModule } from 'src/message-error/message-error.module';
import { userSchema } from 'src/users/schemas/user.schema';
import { SendMailModule } from 'src/shared/send-mail/send-mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'VerificationCode', schema: verificationSchema },
      { name: 'User', schema: userSchema },
    ]),
    MessageErrorModule,
    SendMailModule,
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
