import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSuperlikeStarDto } from './dto/create-superlike-star.dto';
import { UpdateSuperlikeStarDto } from './dto/update-superlike-star.dto';
import { SuperlikeStar } from './interfaces/superlike-star.interfaces';

@Injectable()
export class SuperlikeStarService {
  constructor(
    @InjectModel('SuperlikeStar')
    private readonly superlikeStarModel: Model<SuperlikeStar>,
  ) {}
  async create(createSuperStarDto: CreateSuperlikeStarDto) {
    const superlike = await this.superlikeStarModel.create(createSuperStarDto);
    return superlike;
  }

  async findAll() {
    const superlike = await this.superlikeStarModel.find({});
    return superlike;
  }

  async findOne(id: string) {
    const superlike = await this.superlikeStarModel.findOne({
      _id: id,
    });
    return superlike;
  }

  async update(id: number, updateSuperStarDto: UpdateSuperlikeStarDto) {
    return `This action updates a #${id} supersuperStar`;
  }
}
