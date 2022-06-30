import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'common/guard/roles.guard';
import { MessageErrorService } from 'src/message-error/message-error';
import { BootsService } from './boots.service';
import { CreateBootDto } from './dto/create-boot.dto';

@ApiTags('boots')
@Controller('boots')
export class BootsController {
  constructor(
    private readonly bootsService: BootsService,
    private readonly messageError: MessageErrorService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add new dislike' })
  @ApiBody({
    type: CreateBootDto,
    required: true,
    description: 'Add new boots',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createBootDto: CreateBootDto, @Request() req) {
    try {
      const data = await this.bootsService.create(createBootDto, req.user);
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
  @Get()
  async findAll(@Request() req) {
    try {
      const data = await this.bootsService.findAll(req.user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Create successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }
}
