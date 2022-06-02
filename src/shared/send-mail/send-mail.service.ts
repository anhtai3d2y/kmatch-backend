import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { randomInt } from 'crypto';
import { MessageErrorService } from '../../message-error/message-error';
import * as Bcrypt from 'bcryptjs';

@Injectable()
export class SendMailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly messageError: MessageErrorService,
  ) {}

  async sendMailVerification(email, code, username): Promise<void> {
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Password reset confirmation code ✔',
        template: '/index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: code,
          username: username,
        },
      })
      .then((success) => {
        return success.response;
      })
      .catch((err) => {
        return err;
      });
  }

  async sendUserPass(data) {
    try {
      await this.mailerService
        .sendMail({
          to: data?.email,
          subject: 'Your account has been created ✔',
          template: '/user', // The `.pug` or `.hbs` extension is appended automatically.
          context: {
            // Data to be sent to template engine.
            password: data?.password,
            email: data?.email,
          },
        })
        .then((success) => {
          return success.response;
        });
    } catch (err) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: `${err}`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async sendCodeVerification(data) {
    if (data !== null) {
      try {
        const code = await randomInt(100000, 999999);
        await data.updateOne(
          {
            verification: { code: `${code}`, timeOut: Date.now() + 300000 },
          },
          {
            new: true,
          },
        ),
          await this.mailerService
            .sendMail({
              to: data.email,
              subject: 'Password reset confirmation code ✔',
              template: '/index', // The `.pug` or `.hbs` extension is appended automatically.
              context: {
                // Data to be sent to template engine.
                code: code,
                username: data.name,
              },
            })
            .then((success) => {
              return success.response;
            });
      } catch (err) {
        throw new HttpException(
          {
            statusCode: HttpStatus.FORBIDDEN,
            message: `${err}`,
          },
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw await this.messageError.messageEmailNotFoundService();
    }
  }

  async resetPass(data, resetPass) {
    if (data !== null) {
      if (
        resetPass.verificationCode === data.verification.code &&
        Date.now() <= data.verification.timeOut
      ) {
        if (resetPass.newPassword === resetPass.confirmNewPassword) {
          const newPass = await Bcrypt.hash(
            resetPass.newPassword,
            await Bcrypt.genSalt(),
          );
          return data.updateOne(
            { password: newPass, $unset: { verification: '' } },
            { new: true },
          );
        } else {
          return await this.messageError.messagePassNotConflictFoundService();
        }
      } else {
        return await this.messageError.messageVerificationCodeFoundService();
      }
    } else {
      return await this.messageError.messageEmailNotFoundService();
    }
  }

  async changePass(data, changePass) {
    const checkPass = await Bcrypt.compare(
      changePass.oldPassword,
      data.password,
    );
    if (checkPass) {
      if (changePass.newPassword === changePass.confirmNewPassword) {
        const newPass = await Bcrypt.hash(
          changePass.newPassword,
          await Bcrypt.genSalt(),
        );
        return data.updateOne(
          { password: newPass, $unset: { verification: {} } },
          { new: true },
        );
      } else {
        return await this.messageError.messagePassNotConflictFoundService();
      }
    } else {
      return await this.messageError.messagePasswordWrongFoundService();
    }
  }
}
