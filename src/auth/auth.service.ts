import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service';
import { Model } from 'mongoose';
import { User } from 'src/users/interfaces/user.interfaces';
import * as Bcrypt from 'bcryptjs';
import { LoginRequestDto } from './interfaces/login.interface';
import { ChangePassDto } from 'src/shared/send-mail/dto/change-pass.dto';
import { SendMailService } from 'src/shared/send-mail/send-mail.service';
import { ForgotPasswordDto } from 'src/shared/send-mail/dto/fogot-pass.dto';
import { ResetPasswordDto } from 'src/shared/send-mail/dto/reset-pass.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sendEmail: SendMailService,
    private readonly configService: ConfigService,
  ) {}

  async getJwtAccessToken(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`,
    });
    return accessToken;
  }

  async getJwtRefreshToken(payload: any) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}`,
    });
    return refreshToken;
  }

  async login(payload: LoginRequestDto) {
    const user = await this.userService.findOne(payload.email);
    if (user) {
      const passwordCheck = await Bcrypt.compare(
        payload.password,
        user.password,
      );
      if (passwordCheck) {
        const payloadAccess = {
          email: user.email,
          userId: user._id,
          name: user.name,
          role: user.role,
          type: 'accessToken',
        };
        const payloadRefresh = {
          email: user.email,
          userId: user._id,
          name: user.name,
          role: user.role,
          type: 'refreshToken',
        };

        const accessToken = await this.getJwtAccessToken(payloadAccess);
        const refreshToken = await this.getJwtRefreshToken(payloadRefresh);

        await this.userService.setCurrentRefreshToken(refreshToken, user._id);

        user.password = null;
        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: user,
        };
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Wrong Password. Please try again!',
            error: 'ValidatorError',
          },
          400,
        );
      }
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Login email not found. Please register!',
          error: 'ValidatorError',
        },
        400,
      );
    }
  }

  async sendCodeVerification(verification: ForgotPasswordDto) {
    const data = await this.userService.findOne(verification.email);
    return await this.sendEmail.sendCodeVerification(data);
  }

  async sendCodeVerificationForgotPassword(forgotPassword: ForgotPasswordDto) {
    const data = await this.userService.findOne(forgotPassword.email);
    return await this.sendEmail.sendCodeVerificationForgotPassword(data);
  }

  async resetPassword(resetPassword: ResetPasswordDto) {
    const data = await this.userService.findOne(resetPassword.email);
    return await this.sendEmail.resetPass(data, resetPassword);
  }

  async changePass(email, changePass: ChangePassDto) {
    const data = await this.userService.findOne(email);
    return await this.sendEmail.changePass(data, changePass);
  }
}
