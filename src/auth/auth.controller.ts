import {
  Body,
  Controller,
  HttpStatus,
  Post,
  ClassSerializerInterceptor,
  Request,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
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
import { MessageErrorService } from 'src/message-error/message-error';
import { LoginRequestDto } from './interfaces/login.interface';
import JwtRefreshGuard from './guard/jwtRefresh.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly messageError: MessageErrorService,
  ) {}

  @ApiOperation({ summary: 'refresh Token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() request: any) {
    const payloadAccess = {
      email: request?.user.email,
      userId: request?.user._id,
      name: request?.user.name,
      role: request?.user.role,
      type: 'accessToken',
    };
    try {
      const accessToken = await this.authService.getJwtAccessToken(
        payloadAccess,
      );
      return { accessToken };
    } catch (e) {
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Refresh token is not valid.',
        error: 'Unprocessable Entity',
      };
    }
  }

  @Post('login')
  async login(@Body() payload: LoginRequestDto): Promise<Response> {
    console.log('payload: ', payload);
    try {
      const result = await this.authService.login(payload);
      return {
        statusCode: HttpStatus.OK,
        message: 'Login successfully!',
        data: result,
      };
    } catch (error) {}
    return;
  }

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
  ): Promise<Response> {
    try {
      const data: any = await this.userService.createUser(user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Create successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }
}
