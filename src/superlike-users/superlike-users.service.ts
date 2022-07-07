import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperlikeStar } from 'src/superlike-star/interfaces/superlike-star.interfaces';
import { CreateSuperlikeUserDto } from './dto/create-superlike-user.dto';
import { SuperlikeUsers } from './interfaces/superlike-users.interfaces';

@Injectable()
export class SuperlikeUsersService {
  constructor(
    @InjectModel('SuperlikeUsers')
    private readonly superlikeUserModel: Model<SuperlikeUsers>,
    @InjectModel('SuperlikeStar')
    private readonly superlikeStarModel: Model<SuperlikeStar>,
  ) {}
  async create(createSuperlikeUserDto: CreateSuperlikeUserDto, user) {
    const userId = user._id.toString();
    const superlikeStar = await this.superlikeStarModel.findOne({
      userId: userId,
    });
    if (superlikeStar && superlikeStar.amount > 0) {
      const superlike = await this.superlikeUserModel.create({
        userId: userId,
        userSuperlikedId: createSuperlikeUserDto.userSuperlikedId,
      });
      await superlikeStar.updateOne({
        amount: superlikeStar.amount - 1,
      });
      return superlike;
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: "You don't have enought super like star!",
          error: 'Unprocessable Entity',
        },
        400,
      );
    }
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
      {
        $unwind: '$user',
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
