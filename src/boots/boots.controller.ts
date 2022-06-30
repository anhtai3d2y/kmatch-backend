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
  @ApiOperation({ summary: 'Add new boots' })
  @ApiBody({
    type: CreateBootDto,
    required: true,
    description: 'Add new boots',
  })
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
        message: 'Get boots successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Use boots' })
  @Post('use-boots')
  async useBoots(@Request() req) {
    try {
      const data = await this.bootsService.useBoots(req.user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Use boots successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }
}
