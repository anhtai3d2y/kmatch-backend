import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { calculateAge } from 'utils/util';
import { CreateDislikeUserDto } from './dto/create-dislike-user.dto';
import { DislikeUsers } from './interfaces/dislike-users.interfaces';

@Injectable()
export class DislikeUsersService {
  constructor(
    @InjectModel('DislikeUsers')
    private readonly dislikeUserModel: Model<DislikeUsers>,
  ) {}
  async create(createDislikeUserDto: CreateDislikeUserDto, user) {
    const userId = user._id.toString();
    let dislike = await this.dislikeUserModel.findOne({
      userId: userId,
      userDislikedId: createDislikeUserDto.userDislikedId,
    });
    if (!dislike) {
      dislike = await this.dislikeUserModel.create({
        userId: userId,
        userDislikedId: createDislikeUserDto.userDislikedId,
      });
    }
    return dislike;
  }

  async findAll(user) {
    const userId = user._id.toString();
    const dislike = await this.dislikeUserModel.aggregate([
      { $match: { userId: userId } },
      {
        $addFields: {
          userDislikedId: { $toObjectId: '$userDislikedId' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userDislikedId',
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
    for (let i = 0; i < dislike.length; i++) {
      dislike[i].user.age = calculateAge(dislike[i].user.birthday);
    }
    return dislike;
  }

  async findOne(id: string) {
    const dislike = await this.dislikeUserModel.findOne({
      _id: id,
    });
    return dislike;
  }

  async removeDislikedUser(userDislikedId: string, user) {
    const like = await this.dislikeUserModel.findOneAndDelete({
      userId: user._id.toString(),
      userDislikedId: userDislikedId,
    });
    return like;
  }
}
