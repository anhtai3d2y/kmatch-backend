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
    const like = await this.threadsModel.create(createThreadDto);
    return like;
  }

  async findAll() {
    const like = await this.threadsModel.find({});
    return like;
  }

  async findOne(id: string) {
    const like = await this.threadsModel.findOne({
      _id: id,
    });
    return like;
  }

  async update(id: string, updateThreadDto: UpdateThreadDto) {
    return 'Update';
  }

  async remove(id: string) {
    return 'Delete';
  }
}
