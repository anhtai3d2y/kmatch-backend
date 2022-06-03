import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSuperlikeUserDto } from './dto/create-superlike-user.dto';
import { SuperlikeUsers } from './interfaces/superlike-users.interfaces';

@Injectable()
export class SuperlikeUsersService {
  constructor(
    @InjectModel('SuperlikeUsers')
    private readonly superlikeUserModel: Model<SuperlikeUsers>,
  ) {}
  async create(createSuperlikeUserDto: CreateSuperlikeUserDto, user) {
    const userId = user._id.toString();
    const superlike = await this.superlikeUserModel.create({
      userId: userId,
      userSuperlikedId: createSuperlikeUserDto.userSuperlikedId,
    });
    return superlike;
  }

  async findAll(user) {
    const userId = user._id.toString();
    const superlike = await this.superlikeUserModel.aggregate([
      { $match: { userId: userId } },
      {
        $addFields: {
          userSuperlikedId: { $toObjectId: '$userSuperlikedId' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userSuperlikedId',
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
    return superlike;
  }

  async findOne(id: string) {
    const superlike = await this.superlikeUserModel.findOne({
      _id: id,
    });
    return superlike;
  }
}
