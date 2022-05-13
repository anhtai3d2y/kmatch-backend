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
import { ForgotPassDto } from 'src/shared/send-mail/dto/fogot-pass.dto';
import { ResetPassDto } from 'src/shared/send-mail/dto/reset-pass.dto';

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

  //send mail varificatin
  @ApiOperation({ summary: 'send code Verification password retrieval' })
  @ApiBody({
    type: ForgotPassDto,
    required: true,
    description: 'send code Verification password retrieval',
  })
  @Post('/forgetPass')
  async sendCodeVerification(@Body() forgetpass: ForgotPassDto) {
    try {
      const data = await this.authService.sendCodeVerification(forgetpass);
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
  @ApiOperation({ summary: 'resset password' })
  @ApiBody({
    type: ResetPassDto,
    required: true,
    description: 'reset password',
  })
  @Put('/resetpassword')
  async resetPassword(@Body() resetPass: ResetPassDto) {
    try {
      const data = await this.authService.resetPassword(resetPass);
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
  @ApiOperation({ summary: 'change password' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBody({
    type: ChangePassDto,
    required: true,
    description: 'change password',
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
}
