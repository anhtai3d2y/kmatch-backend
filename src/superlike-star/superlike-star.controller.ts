import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { SuperlikeStarService } from './superlike-star.service';
import { CreateSuperlikeStarDto } from './dto/create-superlike-star.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'utils/response';
import { MessageErrorService } from 'src/message-error/message-error';
import { UpdateSuperlikeStarDto } from './dto/update-superlike-star.dto';
@ApiTags('superlike-star')
@Controller('superlike-star')
export class SuperlikeStarController {
  constructor(
    private readonly superlikeStarService: SuperlikeStarService,
    private readonly messageError: MessageErrorService,
  ) {}

  @ApiOperation({ summary: 'Add new superlike star' })
  @ApiBody({
    type: CreateSuperlikeStarDto,
    required: true,
    description: 'Add new superlike star',
  })
  @Post()
  async create(
    @Body() createSuperlikeStarDto: CreateSuperlikeStarDto,
  ): Promise<Response> {
    try {
      const data: any = await this.superlikeStarService.create(
        createSuperlikeStarDto,
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

  @ApiOperation({ summary: 'Get superlike star' })
  @Get()
  async findAll(): Promise<Response> {
    try {
      const data: any = await this.superlikeStarService.findAll();
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
    return this.superlikeStarService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSuperlikeStarDto: UpdateSuperlikeStarDto,
  ) {
    return this.superlikeStarService.update(+id, updateSuperlikeStarDto);
  }
}
