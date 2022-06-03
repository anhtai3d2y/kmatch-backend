import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { Threads } from './interfaces/threads.interfaces';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectModel('Threads')
    private readonly threadsModel: Model<Threads>,
  ) {}
  async create(createThreadDto: CreateThreadDto) {
    const thread = await this.threadsModel.create(createThreadDto);
    return thread;
  }

  async findAll(user) {
    const userId = user._id.toString();
    const thread = await this.threadsModel.aggregate([
      { $match: { $or: [{ userId: userId }, { otherUserId: userId }] } },
      {
        $addFields: {
          userId: { $toObjectId: '$userId' },
          otherUserId: { $toObjectId: '$otherUserId' },
          threadId: { $toString: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
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
        $lookup: {
          from: 'messages',
          localField: 'threadId',
          foreignField: 'threadId',
          pipeline: [
            {
              $sort: { createdAt: -1 },
            },
          ],
          as: 'messages',
        },
      },
      {
        $addFields: {
          messages: { $first: '$messages' },
        },
      },
    ]);
    return thread;
  }

  async findOne(id: string) {
    const thread = await this.threadsModel.findOne({
      _id: id,
    });
    return thread;
  }

  async update(id: string, updateThreadDto: UpdateThreadDto) {
    return 'Update';
  }

  async remove(id: string) {
    return 'Delete';
  }
}
