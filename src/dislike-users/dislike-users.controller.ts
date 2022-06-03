import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DislikeUsersService } from './dislike-users.service';
import { CreateDislikeUserDto } from './dto/create-dislike-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'utils/response';
import { MessageErrorService } from 'src/message-error/message-error';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'common/guard/roles.guard';
@ApiTags('dislike-users')
@Controller('dislike-users')
export class DislikeUsersController {
  constructor(
    private readonly dislikeUsersService: DislikeUsersService,
    private readonly messageError: MessageErrorService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add new dislike' })
  @ApiBody({
    type: CreateDislikeUserDto,
    required: true,
    description: 'Add new dislike',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createDislikeUserDto: CreateDislikeUserDto,
    @Request() req,
  ): Promise<Response> {
    try {
      const data: any = await this.dislikeUsersService.create(
        createDislikeUserDto,
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
  @ApiOperation({ summary: 'Get dislikes' })
  @Get()
  async findAll(@Request() req): Promise<Response> {
    try {
      const data: any = await this.dislikeUsersService.findAll(req.user);
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
