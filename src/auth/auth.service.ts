import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service';
import { Model } from 'mongoose';
import { User } from 'src/users/interfaces/user.interfaces';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    // private readonly sendEmail: SendMailService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(email: string) {
    // return await this.userModel.create();
  }
}
