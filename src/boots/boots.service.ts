import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/interfaces/user.interfaces';
import { CreateBootDto } from './dto/create-boot.dto';
import { Boots } from './interfaces/boots.interfaces';

@Injectable()
export class BootsService {
  constructor(
    @InjectModel('Boots')
    private readonly bootsModel: Model<Boots>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
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

  async useBoots(user) {
    const boots = await this.bootsModel.findOne({
      userId: user._id,
    });
    if (boots && boots.amount > 0) {
      const userBoots = await this.userModel.findOne({
        _id: user._id,
      });
      // userBoots.boots = Date.now();
      const bootsPlus = 30 * 60 * 1000;
      let bootsTime;
      if (userBoots && userBoots.boots && userBoots.boots < Date.now()) {
        bootsTime = Date.now();
      } else {
        bootsTime = userBoots.boots + bootsPlus;
      }
      await userBoots.updateOne({
        boots: bootsTime + bootsPlus,
      });
      await boots.updateOne({
        amount: boots.amount - 1,
      });
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: "You don't have enough boots. Please buy more boots!",
          error: 'Unprocessable Entity',
        },
        400,
      );
    }
  }
}
