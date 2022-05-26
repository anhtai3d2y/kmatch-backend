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
import { DislikeUsersService } from './dislike-users.service';
import { CreateDislikeUserDto } from './dto/create-dislike-user.dto';
import { UpdateDislikeUserDto } from './dto/update-dislike-user.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('dislike-users')
@Controller('dislike-users')
export class DislikeUsersController {
  constructor(private readonly dislikeUsersService: DislikeUsersService) {}

  @Post()
  create(@Body() createDislikeUserDto: CreateDislikeUserDto) {
    return this.dislikeUsersService.create(createDislikeUserDto);
  }

  @Get()
  findAll() {
    return this.dislikeUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dislikeUsersService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDislikeUserDto: UpdateDislikeUserDto,
  ) {
    return this.dislikeUsersService.update(+id, updateDislikeUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dislikeUsersService.remove(+id);
  }
}
