import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { LikeUsersService } from './like-users.service';
import { CreateLikeUserDto } from './dto/create-like-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'utils/response';
import { MessageErrorService } from 'src/message-error/message-error';
@ApiTags('like-users')
@Controller('like-users')
export class LikeUsersController {
  constructor(
    private readonly likeUsersService: LikeUsersService,
    private readonly messageError: MessageErrorService,
  ) {}

  @ApiOperation({ summary: 'Add new like' })
  @ApiBody({
    type: CreateLikeUserDto,
    required: true,
    description: 'Add new like',
  })
  @Post()
  async create(
    @Body() createLikeUserDto: CreateLikeUserDto,
  ): Promise<Response> {
    try {
      const data: any = await this.likeUsersService.create(createLikeUserDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Create successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @ApiOperation({ summary: 'Get likes' })
  @Get()
  async findAll(): Promise<Response> {
    try {
      const data: any = await this.likeUsersService.findAll();
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
    return this.likeUsersService.findOne(id);
  }
}
