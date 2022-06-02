import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Messages } from './interfaces/messages.interfaces';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Messages')
    private readonly messagesModel: Model<Messages>,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const message = await this.messagesModel.create(createMessageDto);
    return message;
  }

  async findAll() {
    const message = await this.messagesModel.find({});
    return message;
  }
}
