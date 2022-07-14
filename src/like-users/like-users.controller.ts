import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { LikeUsersService } from './like-users.service';
import { CreateLikeUserDto } from './dto/create-like-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'utils/response';
import { MessageErrorService } from 'src/message-error/message-error';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'common/guard/roles.guard';
import { Permission } from 'common/decorators/roles.decorator';
import { ActionEnum } from 'utils/constants/enum/action.enum';
import { cp } from 'fs';
@ApiTags('like-users')
@Controller('like-users')
export class LikeUsersController {
  constructor(
    private readonly likeUsersService: LikeUsersService,
    private readonly messageError: MessageErrorService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add new like' })
  @ApiBody({
    type: CreateLikeUserDto,
    required: true,
    description: 'Add new like',
  })
  @Post()
  async create(
    @Body() createLikeUserDto: CreateLikeUserDto,
    @Request() req,
  ): Promise<Response> {
    try {
      const data: any = await this.likeUsersService.create(
        createLikeUserDto,
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
  @ApiOperation({ summary: 'Get likes' })
  @Get()
  async findAll(@Request() req): Promise<Response> {
    try {
      const data: any = await this.likeUsersService.findAll(req.user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Get successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @Permission(ActionEnum.getUserLikeMe)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get likes' })
  @Get('/see-who-like-me')
  async findUserLikeMe(@Request() req): Promise<Response> {
    try {
      const data: any = await this.likeUsersService.findUserLikeMe(req.user);
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

  @Permission(ActionEnum.removeLikedUser)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove liked user' })
  @Delete(':id')
  async removeLikedUser(@Param('id') id: string, @Request() req) {
    try {
      const data: any = await this.likeUsersService.removeLikedUser(
        id,
        req.user,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Remove successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @Permission(ActionEnum.removeUserLikeMe)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove user like me' })
  @Delete('user-like-me/:id')
  async removeUserLikeMe(@Param('id') id: string, @Request() req) {
    try {
      const data: any = await this.likeUsersService.removeUserLikeMe(
        id,
        req.user,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Remove successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }
}
