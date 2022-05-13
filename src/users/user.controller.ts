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
    // @UploadedFile()
    // file: UploadedFileMetadata,
  ): Promise<Response> {
    try {
      const result = await this.userService.updateUser(
        payload,
        // file?.storageUrl ? payload_image : payload,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'asasdasd',
        data: result,
      };
    } catch (e) {
      return e;
    }
  }
}
