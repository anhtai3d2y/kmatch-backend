import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSuperlikeUserDto } from './dto/create-superlike-user.dto';
import { SuperlikeUsers } from './interfaces/superlike-users.interfaces';

@Injectable()
export class SuperlikeUsersService {
  constructor(
    @InjectModel('SuperlikeUsers')
    private readonly superlikeUserModel: Model<SuperlikeUsers>,
  ) {}
  async create(createSuperlikeUserDto: CreateSuperlikeUserDto) {
    const superlike = await this.superlikeUserModel.create(
      createSuperlikeUserDto,
    );
    return superlike;
  }

  async findAll() {
    const superlike = await this.superlikeUserModel.find({});
    return superlike;
  }

  async findOne(id: string) {
    const superlike = await this.superlikeUserModel.findOne({
      _id: id,
    });
    return superlike;
  }
}
