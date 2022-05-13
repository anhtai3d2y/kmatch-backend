import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConsumes, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { Response } from '../../utils/response';
import { Gender } from '../../utils/constants/enum/gender.enum';
import { RegistrationRequestDto } from './interfaces/signup.interface';
import { AddUserDto } from '../users/dto/addUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Add new student' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: AddUserDto,
    required: true,
    description: 'Add new user',
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('signup')
  async createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() user: AddUserDto,
  ): Promise<any> {
    console.log('file: ', file);
    console.log('user: ', user);
    try {
      return await this.userService.createUser(user);
    } catch (error) {
      return error;
    }
    return user;
  }
}
