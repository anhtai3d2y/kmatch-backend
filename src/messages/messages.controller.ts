import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  CreateMessageDto,
  CreateMessageImageDto,
} from './dto/create-message.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MessageErrorService } from 'src/message-error/message-error';
import { Response } from 'utils/response';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'common/guard/roles.guard';
import { FilterMessageDto } from './dto/filter-message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messageError: MessageErrorService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add new message' })
  @ApiBody({
    type: CreateMessageDto,
    required: true,
    description: 'Add new match',
  })
  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
  ): Promise<Response> {
    try {
      const data: any = await this.messagesService.create(
        createMessageDto,
        req.user,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Create successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add new image message' })
  @ApiBody({
    type: CreateMessageImageDto,
    required: true,
    description: 'Add new match',
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @Post('/image')
  async createImageMessage(
    @Body() createMessageImageDto: CreateMessageImageDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<Response> {
    try {
      const data: any = await this.messagesService.createImageMessage(
        createMessageImageDto,
        file,
        req.user,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Create successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get messages' })
  @Get()
  async findAll(
    @Query() filterMessageDto: FilterMessageDto,
    @Request() req,
  ): Promise<Response> {
    try {
      const data: any = await this.messagesService.findAll(
        filterMessageDto,
        req.user,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Get successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }
}
