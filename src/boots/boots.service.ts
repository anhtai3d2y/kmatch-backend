import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBootDto } from './dto/create-boot.dto';
import { Boots } from './interfaces/boots.interfaces';

@Injectable()
export class BootsService {
  constructor(
    @InjectModel('Boots')
    private readonly bootsModel: Model<Boots>,
  ) {}

  async create(createBootDto: CreateBootDto, user) {
    const boot = await this.bootsModel.findOne({
      userId: user._id,
    });
    let data;
    if (!boot) {
      data = await this.bootsModel.create({
        userId: user._id,
        amount: createBootDto.amount,
      });
    } else {
      boot.amount += createBootDto.amount;
      await boot.updateOne({
        userId: boot.userId,
        amount: boot.amount,
      });
      data = boot;
    }
    return data;
  }

  async findAll(user) {
    const data = await this.bootsModel.find({
      userId: user._id,
    });
    return data;
  }
}
