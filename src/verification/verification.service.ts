import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageErrorService } from 'src/message-error/message-error';
import { SendMailService } from 'src/shared/send-mail/send-mail.service';
import { User } from 'src/users/interfaces/user.interfaces';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { GetVerificationDto } from './dto/get-verification.dto';
import { Veritification } from './interfaces/verification.interfaces';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel('VerificationCode')
    private readonly verificationModel: Model<Veritification>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private readonly sendEmail: SendMailService,
    private readonly messageError: MessageErrorService,
  ) {}

  async create(createVerificationDto: CreateVerificationDto) {
    try {
    } catch (error) {}
    const user = await this.userModel.findOne({
      email: createVerificationDto.email,
    });
    if (user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'This email already registed!',
          error: 'Conflict',
        },
        409,
      );
    }
    const code = await this.sendEmail.sendCodeVerification(
      createVerificationDto.email,
    );
    if (code.verificationCode) {
      await this.verificationModel.deleteOne({
        email: createVerificationDto.email,
      });
      await this.verificationModel.create({
        email: createVerificationDto.email,
        verification: {
          code: `${code.verificationCode}`,
          timeOut: Date.now() + 1800000,
        },
      });
    }
    return createVerificationDto.email;
  }

  async getVerification(getVerificationDto: GetVerificationDto) {
    console.log(getVerificationDto);
    const verification = await this.verificationModel.findOne({
      email: getVerificationDto.email,
    });
    if (verification) {
      if (
        getVerificationDto.verificationCode ===
          verification.verification.code &&
        Date.now() <= verification.verification.timeOut
      ) {
        return await this.verificationModel.deleteOne({
          email: getVerificationDto.email,
        });
      } else {
        return await this.messageError.messageVerificationCodeFoundService();
      }
    } else {
      return await this.messageError.messageEmailNotFoundService();
    }
  }
}
