import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { caculateDates } from 'src/shared/function-shared';
import { calculateAge } from 'utils/util';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Matches } from './interfaces/matches.interfaces';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Matches')
    private readonly matchesModel: Model<Matches>,
  ) {}
  async create(createMatchDto: CreateMatchDto) {
    let match = await this.matchesModel.findOne({
      $or: [
        {
          $and: [
            { userId: createMatchDto.userId },
            { otherUserId: createMatchDto.otherUserId },
          ],
        },
        {
          $and: [
            { userId: createMatchDto.otherUserId },
            { otherUserId: createMatchDto.userId },
          ],
        },
      ],
    });
    if (!match) {
      match = await this.matchesModel.create(createMatchDto);
    }
    return match;
  }

  async findAll(user) {
    const userId = user._id.toString();
    const match = await this.matchesModel.aggregate([
      {
        $match: { $or: [{ userId: userId }, { otherUserId: userId }] },
      },
      {
        $addFields: {
          userId: { $toObjectId: '$userId' },
          otherUserId: { $toObjectId: '$otherUserId' },
        },
      },
      {
        $addFields: {
          userId: {
            $cond: {
              if: { $eq: ['$userId', user._id] },
              then: '$userId',
              else: '$otherUserId',
            },
          },
          otherUserId: {
            $cond: {
              if: { $ne: ['$userId', user._id] },
              then: '$userId',
              else: '$otherUserId',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'otherUserId',
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
          as: 'otherUser',
        },
      },
      {
        $unwind: '$otherUser',
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    for (let i = 0; i < match.length; i++) {
      match[i].otherUser.age = calculateAge(match[i].otherUser.birthday);
    }
    return match;
  }

  async findOne(id: string) {
    const match = await this.matchesModel.findOne({
      _id: id,
    });
    return match;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    return 'Update';
  }

  async remove(id: string) {
    return 'Delete';
  }
}
