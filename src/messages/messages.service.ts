import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { formatDate, uuid } from 'utils/util';
import {
  CreateMessageDto,
  CreateMessageImageDto,
} from './dto/create-message.dto';
import { FilterMessageDto } from './dto/filter-message.dto';
import { Messages } from './interfaces/messages.interfaces';
import * as fs from 'fs';
import { deleteFile, uploadFile } from 'utils/cloudinary';
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

  async createImageMessage(
    createMessageImageDto: CreateMessageImageDto,
    file: any,
    user,
  ) {
    const fileName = `./images/${uuid()}.png`;
    await fs.createWriteStream(fileName).write(file.buffer);
    const fileUploaded = await uploadFile(fileName);
    fs.unlink(fileName, (err) => {
      if (err) console.log('err: ', err);
    });
    const userId = user._id.toString();
    const message = await this.messagesModel.create({
      threadId: createMessageImageDto.threadId,
      senderId: userId,
      receiverId: createMessageImageDto.receiverId,
      messageType: createMessageImageDto.messageType,
      messageBody: fileUploaded.secure_url,
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
        $sort: { createdAt: 1 },
      },
    ]);
    for (let i = 0; i < message.length; i++) {
      if (message[i].senderId === userId) {
        message[i].mine = true;
      } else {
        message[i].mine = false;
      }
      message[i].time = formatDate(message[i].createdAt);
    }
    return message;
  }
}
