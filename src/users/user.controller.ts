import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { Response } from '../../utils/response';
import {
  Body,
  Query,
  Controller,
  Delete,
  HttpStatus,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Post,
  HttpException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FilterUserDto } from './dto/filterUserdto';
import { MessageErrorService } from 'src/message-error/message-error';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'common/guard/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Permission } from 'common/decorators/roles.decorator';
import { ActionEnum } from 'utils/constants/enum/action.enum';
import { PagingDto } from 'src/shared/handling-paging/dto/paging.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  // @Permission(ActionEnum.getUser)
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user' })
  async getAllOrSearchUser(
    @Request() req,
    @Query() search: FilterUserDto,
  ): Promise<Response> {
    console.log('user: ', req.user);
    try {
      const data: any = await this.userService.getAllOrSearchUser(
        search.textSearch,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Get successfully',
        data: data,
      };
    } catch (e) {
      const message = e.response?.message;
      let messageError: any = message;
      if (e.response?.error === 'ID_NOT_FOUND') {
        messageError = message;
      } else if (e.response?.error === 'Conflict') {
        messageError = message;
      } else {
        messageError = 'A system error has occurred!';
      }
      return {
        success: false,
        message: messageError,
        error: 'Unprocessable Entity',
      };
    }
  }

  @Get('news-feed')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get users newsfeed' })
  async getUsersNewsfeed(
    @Request() req,
    @Query() paging: PagingDto,
  ): Promise<Response> {
    try {
      const data: any = await this.userService.getUsersNewsfeed(
        paging,
        req.user,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Get successfully',
        data: data,
      };
    } catch (e) {
      const message = e.response?.message;
      let messageError: any = message;
      if (e.response?.error === 'ID_NOT_FOUND') {
        messageError = message;
      } else if (e.response?.error === 'Conflict') {
        messageError = message;
      } else {
        messageError = 'A system error has occurred!';
      }
      return {
        success: false,
        message: messageError,
        error: 'Unprocessable Entity',
      };
    }
  }

  // @Post()
  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiBody({
    type: UpdateUserDto,
    required: true,
    description: 'Update user',
  })
  async updateUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UpdateUserDto,
  ): Promise<Response> {
    try {
      const result = await this.userService.updateUser(payload, file);
      return {
        statusCode: HttpStatus.OK,
        message: 'Update user successfully!',
        data: result,
      };
    } catch (e) {
      return e;
    }
  }
}
