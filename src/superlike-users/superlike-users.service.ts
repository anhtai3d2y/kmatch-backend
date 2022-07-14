import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeUsers } from 'src/like-users/interfaces/like-users.interfaces';
import { Matches } from 'src/matches/interfaces/matches.interfaces';
import { SuperlikeStar } from 'src/superlike-star/interfaces/superlike-star.interfaces';
import { User } from 'src/users/interfaces/user.interfaces';
import { calculateAge } from 'utils/util';
import { CreateSuperlikeUserDto } from './dto/create-superlike-user.dto';
import { SuperlikeUsers } from './interfaces/superlike-users.interfaces';

@Injectable()
export class SuperlikeUsersService {
  constructor(
    @InjectModel('SuperlikeUsers')
    private readonly superlikeUserModel: Model<SuperlikeUsers>,
    @InjectModel('LikeUsers')
    private readonly likeUserModel: Model<LikeUsers>,
    @InjectModel('SuperlikeStar')
    private readonly superlikeStarModel: Model<SuperlikeStar>,
    @InjectModel('Matches')
    private readonly matchesModel: Model<Matches>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}
  async create(createSuperlikeUserDto: CreateSuperlikeUserDto, user) {
    const userId = user._id.toString();
    let isMatched = false;
    let superlike = await this.superlikeUserModel.findOne({
      userId: userId,
      userSuperlikedId: createSuperlikeUserDto.userSuperlikedId,
    });
    const superlikeStar = await this.superlikeStarModel.findOne({
      userId: userId,
    });
    if (superlikeStar && superlikeStar.amount > 0) {
      if (!superlike) {
        superlike = await this.superlikeUserModel.create({
          userId: userId,
          userSuperlikedId: createSuperlikeUserDto.userSuperlikedId,
        });
        await superlikeStar.updateOne({
          amount: superlikeStar.amount - 1,
        });
      }
      const likeMatched = await this.likeUserModel.findOne({
        userId: createSuperlikeUserDto.userSuperlikedId,
        userLikedId: userId,
      });
      const superlikeMatched = await this.superlikeUserModel.findOne({
        userId: createSuperlikeUserDto.userSuperlikedId,
        userSuperlikedId: userId,
      });
      isMatched = false;
      let userName = '';
      let userAvatar = '';
      let otherUserAvatar = '';
      if (likeMatched || superlikeMatched) {
        isMatched = true;
        await this.matchesModel.create({
          userId: userId,
          otherUserId: createSuperlikeUserDto.userSuperlikedId,
        });
        const user = await this.userModel.findOne({
          _id: userId,
        });
        const otherUser = await this.userModel.findOne({
          _id: createSuperlikeUserDto.userSuperlikedId,
        });
        userAvatar = user.avatar;
        otherUserAvatar = otherUser.avatar;
        userName = otherUser.name;
      }
      return {
        userId: superlike.userId,
        userLikedId: superlike.userSuperlikedId,
        _id: superlike._id,
        isMatched: isMatched,
        userName: userName,
        userAvatar: userAvatar,
        otherUserAvatar: otherUserAvatar,
      };
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
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    for (let i = 0; i < superlike.length; i++) {
      superlike[i].user.age = calculateAge(superlike[i].user.birthday);
    }
    return superlike;
  }

  async findOne(id: string) {
    const superlike = await this.superlikeUserModel.findOne({
      _id: id,
    });
    return superlike;
  }
}
