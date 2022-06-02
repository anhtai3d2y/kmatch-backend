import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'utils/response';
import { MessageErrorService } from 'src/message-error/message-error';
@ApiTags('threads')
@Controller('threads')
export class ThreadsController {
  constructor(
    private readonly threadsService: ThreadsService,
    private readonly messageError: MessageErrorService,
  ) {}

  @ApiOperation({ summary: 'Add new thread' })
  @ApiBody({
    type: CreateThreadDto,
    required: true,
    description: 'Add new thread',
  })
  @Post()
  async create(@Body() createThreadDto: CreateThreadDto): Promise<Response> {
    try {
      const data: any = await this.threadsService.create(createThreadDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Create successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @ApiOperation({ summary: 'Get threads' })
  @Get()
  async findAll(): Promise<Response> {
    try {
      const data: any = await this.threadsService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Get successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.threadsService.findOne(id);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() updateThreadDto: UpdateThreadDto) {
    return this.threadsService.update(id, updateThreadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.threadsService.remove(id);
  }
}
