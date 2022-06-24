import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    const like = await this.matchesModel.create(createMatchDto);
    return like;
  }

  async findAll(user) {
    const userId = user._id.toString();
    const like = await this.matchesModel.aggregate([
      {
        $match: { $or: [{ userId: userId }, { otherUserId: userId }] },
      },
      // {
      //   $addFields: {
      //     userId: { $toObjectId: '$userId' },
      //     otherUserId: { $toObjectId: '$otherUserId' },
      //   },
      // },
      // {
      //   $addFields: {
      //     userId: {
      //       $cond: {
      //         if: { $eq: ['$userId', user._id] },
      //         then: '$userId',
      //         else: '$otherUserId',
      //       },
      //     },
      //     otherUserId: {
      //       $cond: {
      //         if: { $ne: ['$userId', user._id] },
      //         then: '$userId',
      //         else: '$otherUserId',
      //       },
      //     },
      //   },
      // },
      // {
      //   $lookup: {
      //     from: 'users',
      //     localField: 'otherUserId',
      //     foreignField: '_id',
      //     pipeline: [
      //       {
      //         $project: {
      //           name: 1,
      //           avatar: 1,
      //           gender: 1,
      //           birthday: 1,
      //         },
      //       },
      //     ],
      //     as: 'otherUser',
      //   },
      // },
      // {
      //   $sort: { createdAt: -1 },
      // },
    ]);
    return like;
  }

  async findOne(id: string) {
    const like = await this.matchesModel.findOne({
      _id: id,
    });
    return like;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    return 'Update';
  }

  async remove(id: string) {
    return 'Delete';
  }
}
