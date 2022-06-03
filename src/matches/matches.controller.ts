import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'utils/response';
import { MessageErrorService } from 'src/message-error/message-error';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'common/guard/roles.guard';
@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly messageError: MessageErrorService,
  ) {}

  @ApiOperation({ summary: 'Add new match' })
  @ApiBody({
    type: CreateMatchDto,
    required: true,
    description: 'Add new match',
  })
  @Post()
  async create(@Body() createMatchDto: CreateMatchDto): Promise<Response> {
    try {
      const data: any = await this.matchesService.create(createMatchDto);
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
  @ApiOperation({ summary: 'Get matches' })
  @Get()
  async findAll(@Request() req): Promise<Response> {
    try {
      const data: any = await this.matchesService.findAll(req.user);
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
    return this.matchesService.findOne(id);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchesService.remove(id);
  }
}
