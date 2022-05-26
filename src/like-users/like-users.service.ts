import { Injectable } from '@nestjs/common';
import { CreateLikeUserDto } from './dto/create-like-user.dto';
import { UpdateLikeUserDto } from './dto/update-like-user.dto';

@Injectable()
export class LikeUsersService {
  create(createLikeUserDto: CreateLikeUserDto) {
    return 'This action adds a new likeUser';
  }

  findAll() {
    return `This action returns all likeUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} likeUser`;
  }

  update(id: number, updateLikeUserDto: UpdateLikeUserDto) {
    return `This action updates a #${id} likeUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} likeUser`;
  }
}
