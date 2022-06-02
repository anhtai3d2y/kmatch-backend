import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { DislikeUsersService } from './dislike-users.service';
import { CreateDislikeUserDto } from './dto/create-dislike-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'utils/response';
import { MessageErrorService } from 'src/message-error/message-error';
@ApiTags('dislike-users')
@Controller('dislike-users')
export class DislikeUsersController {
  constructor(
    private readonly dislikeUsersService: DislikeUsersService,
    private readonly messageError: MessageErrorService,
  ) {}

  @ApiOperation({ summary: 'Add new dislike' })
  @ApiBody({
    type: CreateDislikeUserDto,
    required: true,
    description: 'Add new dislike',
  })
  @Post()
  async create(
    @Body() createDislikeUserDto: CreateDislikeUserDto,
  ): Promise<Response> {
    try {
      const data: any = await this.dislikeUsersService.create(
        createDislikeUserDto,
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

  @ApiOperation({ summary: 'Get dislikes' })
  @Get()
  async findAll(): Promise<Response> {
    try {
      const data: any = await this.dislikeUsersService.findAll();
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
    return this.dislikeUsersService.findOne(id);
  }
}
