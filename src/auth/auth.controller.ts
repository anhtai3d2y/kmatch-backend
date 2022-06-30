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
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiConsumes,
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
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
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'common/guard/roles.guard';
import { ChangePassDto } from 'src/shared/send-mail/dto/change-pass.dto';
import { ForgotPasswordDto } from 'src/shared/send-mail/dto/fogot-pass.dto';
import { ResetPasswordDto } from 'src/shared/send-mail/dto/reset-pass.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly messageError: MessageErrorService,
  ) {}

  @ApiOperation({ summary: 'Refresh Token' })
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

  @ApiOperation({ summary: 'User login' })
  @Post('login')
  async login(@Body() payload: LoginRequestDto): Promise<Response> {
    try {
      const result = await this.authService.login(payload);
      return {
        statusCode: HttpStatus.OK,
        message: 'Login successfully!',
        data: result,
      };
    } catch (e) {
      const message = e.message || 'A system error has occurred!';
      const statusCode = e.statusCode || HttpStatus.UNPROCESSABLE_ENTITY;
      const error = e.error || 'Unprocessable Entity';

      return {
        statusCode: statusCode,
        message: message,
        error: error,
      };
    }
  }

  @ApiOperation({ summary: 'Add new user' })
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
      const data: any = await this.userService.createUser(user, file);
      return {
        statusCode: HttpStatus.OK,
        message: 'Create successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  //send mail varificatin
  @ApiOperation({ summary: 'Send code verification for register' })
  @ApiBody({
    type: ForgotPasswordDto,
    required: true,
    description: 'Send code verification for register',
  })
  @Post('/verification')
  async sendCodeVerification(@Body() verification: ForgotPasswordDto) {
    try {
      const data = await this.authService.sendCodeVerification(verification);
      return {
        statusCode: HttpStatus.OK,
        message:
          'Send mail successfully, please check your email to enter the confirmation code',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  //send mail varificatin
  @ApiOperation({ summary: 'Send code verification password retrieval' })
  @ApiBody({
    type: ForgotPasswordDto,
    required: true,
    description: 'Send code verification password retrieval',
  })
  @Post('/forgetpassword')
  async sendCodeVerificationForgotPassword(
    @Body() forgetpassword: ForgotPasswordDto,
  ) {
    try {
      const data = await this.authService.sendCodeVerificationForgotPassword(
        forgetpassword,
      );
      return {
        statusCode: HttpStatus.OK,
        message:
          'Send mail successfully, please check your email to enter the confirmation code',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  //reset pass
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    type: ResetPasswordDto,
    required: true,
    description: 'Reset password',
  })
  @Put('/resetpassword')
  async resetPassword(@Body() resetPassword: ResetPasswordDto) {
    try {
      const data = await this.authService.resetPassword(resetPassword);
      return {
        statusCode: HttpStatus.OK,
        message: 'reset password successfullys',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBody({
    type: ChangePassDto,
    required: true,
    description: 'Change password',
  })
  @Put()
  async changePass(@Request() req, @Body() changePass: ChangePassDto) {
    try {
      const data = await this.authService.changePass(
        req.user.email,
        changePass,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'change password successfullys',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @Post('seeder')
  async generateUsers(): Promise<Response> {
    try {
      const data: any = await this.userService.generateUsers();
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
