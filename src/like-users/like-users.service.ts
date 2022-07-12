import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperlikeUsers } from 'src/superlike-users/interfaces/superlike-users.interfaces';
import { calculateAge } from 'utils/util';
import { CreateLikeUserDto } from './dto/create-like-user.dto';
import { LikeUsers } from './interfaces/like-users.interfaces';

@Injectable()
export class LikeUsersService {
  constructor(
    @InjectModel('LikeUsers')
    private readonly likeUserModel: Model<LikeUsers>,
    @InjectModel('SuperlikeUsers')
    private readonly superlikeUserModel: Model<SuperlikeUsers>,
  ) {}
  async create(createLikeUserDto: CreateLikeUserDto, user) {
    const userId = user._id.toString();
    const like = await this.likeUserModel.create({
      userId: userId,
      userLikedId: createLikeUserDto.userLikedId,
    });
    const likeMatched = await this.likeUserModel.findOne({
      userId: createLikeUserDto.userLikedId,
      userLikedId: userId,
    });
    const superlikeMatched = await this.superlikeUserModel.findOne({
      userId: createLikeUserDto.userLikedId,
      userSuperlikedId: userId,
    });
    let isMatched = false;
    if (likeMatched || superlikeMatched) {
      isMatched = true;
    }
    return {
      userId: like.userId,
      userLikedId: like.userLikedId,
      _id: like._id,
      isMatched: isMatched,
    };
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
      {
        $unwind: '$user',
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    for (let i = 0; i < like.length; i++) {
      like[i].user.age = calculateAge(like[i].user.birthday);
    }
    return like;
  }

  async findOne(id: string) {
    const like = await this.likeUserModel.findOne({
      _id: id,
    });
    return like;
  }
}
