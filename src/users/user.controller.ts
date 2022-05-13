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

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'get user' })
  async getAllOrSearchUser(
    @Request() req,
    @Query() search: FilterUserDto,
  ): Promise<Response> {
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
        messageError = 'common.SYSTEM_ERROR';
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
  // @Permission(ActionEnum.updateAdminUser)
  @ApiOperation({ summary: 'update user' })
  // @UseInterceptors(
  //   GCloudStorageFileInterceptor('image', multerConfigOptions, {
  //     prefix: 'avatar/admin',
  //   }),
  // )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        phone: {
          type: 'string',
        },
        position: {
          type: 'string',
        },
        role: {
          type: 'string',
          // enum: AdminRole,
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateUser(
    @Param('id') id,
    @Body() payload: UpdateUserDto,
    // @UploadedFile()
    // file: UploadedFileMetadata,
  ): Promise<Response> {
    try {
      // const result = await this.userService.updateUser(
      //   id,
      //   file?.storageUrl ? payload_image : payload,
      // );
      return {
        statusCode: HttpStatus.OK,
        message: 'asasdasd',
        data: [],
      };
    } catch (e) {
      return e;
    }
  }
}
