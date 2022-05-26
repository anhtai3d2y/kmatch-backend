import { Injectable } from '@nestjs/common';
import { CreateSuperLikeDto } from './dto/create-super-like.dto';
import { UpdateSuperLikeDto } from './dto/update-super-like.dto';

@Injectable()
export class SuperLikeService {
  create(createSuperLikeDto: CreateSuperLikeDto) {
    return 'This action adds a new superLike';
  }

  findAll() {
    return `This action returns all superLike`;
  }

  findOne(id: number) {
    return `This action returns a #${id} superLike`;
  }

  update(id: number, updateSuperLikeDto: UpdateSuperLikeDto) {
    return `This action updates a #${id} superLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} superLike`;
  }
}
