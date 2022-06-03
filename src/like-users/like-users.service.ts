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
  async create(createLikeUserDto: CreateLikeUserDto, user) {
    const userId = user._id.toString();
    const like = await this.likeUserModel.create({
      userId: userId,
      userLikedId: createLikeUserDto.userLikedId,
    });
    return like;
  }

  async findAll(user) {
    const userId = user._id.toString();
    const like = await this.likeUserModel.aggregate([
      { $match: { userId: userId } },
      {
        $addFields: {
          userLikedId: { $toObjectId: '$userLikedId' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userLikedId',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                name: 1,
                avatar: 1,
                gender: 1,
                birthday: 1,
              },
            },
          ],
          as: 'user',
        },
      },
    ]);
    return like;
  }

  async findOne(id: string) {
    const like = await this.likeUserModel.findOne({
      _id: id,
    });
    return like;
  }
}
