import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SuperlikeUsersService } from './superlike-users.service';
import { CreateSuperlikeUserDto } from './dto/create-superlike-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'utils/response';
import { MessageErrorService } from 'src/message-error/message-error';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'common/guard/roles.guard';
@ApiTags('superlike-users')
@Controller('superlike-users')
export class SuperlikeUsersController {
  constructor(
    private readonly superlikeUsersService: SuperlikeUsersService,
    private readonly messageError: MessageErrorService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add new superlike' })
  @ApiBody({
    type: CreateSuperlikeUserDto,
    required: true,
    description: 'Add new superlike',
  })
  @Post()
  async create(
    @Body() createSuperlikeUserDto: CreateSuperlikeUserDto,
    @Request() req,
  ): Promise<Response> {
    try {
      const data: any = await this.superlikeUsersService.create(
        createSuperlikeUserDto,
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
  @ApiOperation({ summary: 'Get superlikes' })
  @Get()
  async findAll(@Request() req): Promise<Response> {
    try {
      const data: any = await this.superlikeUsersService.findAll(req.user);
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
    return this.superlikeUsersService.findOne(id);
  }
}
