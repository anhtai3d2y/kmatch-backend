import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InterestedGenderService } from './interested-gender.service';
import { CreateInterestedGenderDto } from './dto/create-interested-gender.dto';
import { UpdateInterestedGenderDto } from './dto/update-interested-gender.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('interested-gender')
@Controller('interested-gender')
export class InterestedGenderController {
  constructor(
    private readonly interestedGenderService: InterestedGenderService,
  ) {}

  @Post()
  create(@Body() createInterestedGenderDto: CreateInterestedGenderDto) {
    return this.interestedGenderService.create(createInterestedGenderDto);
  }

  @Get()
  findAll() {
    return this.interestedGenderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interestedGenderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInterestedGenderDto: UpdateInterestedGenderDto,
  ) {
    return this.interestedGenderService.update(+id, updateInterestedGenderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interestedGenderService.remove(+id);
  }
}
