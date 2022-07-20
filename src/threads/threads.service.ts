import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { formatDate } from 'utils/util';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { Threads } from './interfaces/threads.interfaces';
@Injectable()
export class ThreadsService {
  constructor(
    @InjectModel('Threads')
    private readonly threadsModel: Model<Threads>,
  ) {}
  async create(createThreadDto: CreateThreadDto, user: any) {
    let thread = await this.threadsModel.findOne({
      $or: [
        {
          $and: [
            { userId: user._id },
            { otherUserId: createThreadDto.otherUserId },
          ],
        },
        {
          $and: [
            { userId: createThreadDto.otherUserId },
            { otherUserId: user._id },
          ],
        },
      ],
    });
    if (!thread) {
      thread = await this.threadsModel.create({
        userId: user._id,
        otherUserId: createThreadDto.otherUserId,
      });
    }
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
        $sort: { createdAt: -1 },
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
        $unwind: '$user',
      },
      {
        $unwind: '$otherUser',
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
      {
        $sort: { 'messages.createdAt': -1 },
      },
    ]);
    for (let i = 0; i < thread.length; i++) {
      if (thread[i].user._id.toString() !== userId) {
        const tempUserId = thread[i].userId;
        thread[i].userId = thread[i].otherUserId;
        thread[i].otherUserId = tempUserId;
        const tempUser = thread[i].user;
        thread[i].user = thread[i].otherUser;
        thread[i].otherUser = tempUser;
      }
      thread[i].timeCreated = formatDate(thread[i].createdAt);
      if (thread[i].messages) {
        thread[i].messages.time = formatDate(thread[i].messages.createdAt);
        if (thread[i].messages.messageType === 'Image') {
          thread[i].messages.messageBody = 'Send an image';
        }
        if (thread[i].user._id.toString() === thread[i].messages.senderId) {
          thread[
            i
          ].messages.messageBody = `You: ${thread[i].messages.messageBody}`;
        }
      } else {
        thread[i].messages = {
          messageType: 'Text',
          messageBody: 'Say hello!',
          createdAt: thread[i].createdAt,
        };
        thread[i].messages.time = formatDate(thread[i].messages.createdAt);
      }
    }
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

  async remove(id: any) {
    return 'Delete';
  }
}
