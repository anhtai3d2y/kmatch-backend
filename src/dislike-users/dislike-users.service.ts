import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDislikeUserDto } from './dto/create-dislike-user.dto';
import { DislikeUsers } from './interfaces/dislike-users.interfaces';

@Injectable()
export class DislikeUsersService {
  constructor(
    @InjectModel('DislikeUsers')
    private readonly dislikeUserModel: Model<DislikeUsers>,
  ) {}
  async create(createDislikeUserDto: CreateDislikeUserDto) {
    const dislike = await this.dislikeUserModel.create(createDislikeUserDto);
    return dislike;
  }

  async findAll() {
    const dislike = await this.dislikeUserModel.find({});
    return dislike;
  }

  async findOne(id: string) {
    const dislike = await this.dislikeUserModel.findOne({
      _id: id,
    });
    return dislike;
  }
}
