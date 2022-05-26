import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LikeUsersService } from './like-users.service';
import { CreateLikeUserDto } from './dto/create-like-user.dto';
import { UpdateLikeUserDto } from './dto/update-like-user.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('like-users')
@Controller('like-users')
export class LikeUsersController {
  constructor(private readonly likeUsersService: LikeUsersService) {}

  @Post()
  create(@Body() createLikeUserDto: CreateLikeUserDto) {
    return this.likeUsersService.create(createLikeUserDto);
  }

  @Get()
  findAll() {
    return this.likeUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likeUsersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLikeUserDto: UpdateLikeUserDto,
  ) {
    return this.likeUsersService.update(+id, updateLikeUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeUsersService.remove(+id);
  }
}
