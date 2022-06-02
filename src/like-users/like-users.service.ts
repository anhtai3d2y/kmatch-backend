import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLikeUserDto } from './dto/create-like-user.dto';
import { LikeUsers } from './interfaces/like-users.interfaces';

@Injectable()
export class LikeUsersService {
  constructor(
    @InjectModel('LikeUsers')
    private readonly likeUserModel: Model<LikeUsers>,
  ) {}
  async create(createLikeUserDto: CreateLikeUserDto) {
    const like = await this.likeUserModel.create(createLikeUserDto);
    return like;
  }

  async findAll() {
    const like = await this.likeUserModel.find({});
    return like;
  }

  async findOne(id: string) {
    const like = await this.likeUserModel.findOne({
      _id: id,
    });
    return like;
  }
}
