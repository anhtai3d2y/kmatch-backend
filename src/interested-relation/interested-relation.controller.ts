import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InterestedRelationService } from './interested-relation.service';
import { CreateInterestedRelationDto } from './dto/create-interested-relation.dto';
import { UpdateInterestedRelationDto } from './dto/update-interested-relation.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('interested-relation')
@Controller('interested-relation')
export class InterestedRelationController {
  constructor(
    private readonly interestedRelationService: InterestedRelationService,
  ) {}

  @Post()
  create(@Body() createInterestedRelationDto: CreateInterestedRelationDto) {
    return this.interestedRelationService.create(createInterestedRelationDto);
  }

  @Get()
  findAll() {
    return this.interestedRelationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interestedRelationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInterestedRelationDto: UpdateInterestedRelationDto,
  ) {
    return this.interestedRelationService.update(
      +id,
      updateInterestedRelationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interestedRelationService.remove(+id);
  }
}
