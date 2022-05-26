import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { SuperLikeService } from './super-like.service';
import { CreateSuperLikeDto } from './dto/create-super-like.dto';
import { UpdateSuperLikeDto } from './dto/update-super-like.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('super-like')
@Controller('super-like')
export class SuperLikeController {
  constructor(private readonly superLikeService: SuperLikeService) {}

  @Post()
  create(@Body() createSuperLikeDto: CreateSuperLikeDto) {
    return this.superLikeService.create(createSuperLikeDto);
  }

  @Get()
  findAll() {
    return this.superLikeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.superLikeService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSuperLikeDto: UpdateSuperLikeDto,
  ) {
    return this.superLikeService.update(+id, updateSuperLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.superLikeService.remove(+id);
  }
}
