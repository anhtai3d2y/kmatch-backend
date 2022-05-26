import { Injectable } from '@nestjs/common';
import { CreateDislikeUserDto } from './dto/create-dislike-user.dto';
import { UpdateDislikeUserDto } from './dto/update-dislike-user.dto';

@Injectable()
export class DislikeUsersService {
  create(createDislikeUserDto: CreateDislikeUserDto) {
    return 'This action adds a new dislikeUser';
  }

  findAll() {
    return `This action returns all dislikeUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dislikeUser`;
  }

  update(id: number, updateDislikeUserDto: UpdateDislikeUserDto) {
    return `This action updates a #${id} dislikeUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} dislikeUser`;
  }
}
