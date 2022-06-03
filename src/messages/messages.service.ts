import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { FilterMessageDto } from './dto/filter-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Messages } from './interfaces/messages.interfaces';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Messages')
    private readonly messagesModel: Model<Messages>,
  ) {}
  async create(createMessageDto: CreateMessageDto, user) {
    const userId = user._id.toString();
    const message = await this.messagesModel.create({
      threadId: createMessageDto.threadId,
      senderId: userId,
      receiverId: createMessageDto.receiverId,
      messageType: createMessageDto.messageType,
      messageBody: createMessageDto.messageBody,
    });
    return message;
  }

  async findAll(filterMessageDto: FilterMessageDto, user) {
    const userId = user._id.toString();
    const message = await this.messagesModel.aggregate([
      {
        $match: { threadId: filterMessageDto.threadId },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return message;
  }
}
