import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Matches } from './interfaces/matches.interfaces';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Matches')
    private readonly matchesModel: Model<Matches>,
  ) {}
  async create(createMatchDto: CreateMatchDto) {
    const like = await this.matchesModel.create(createMatchDto);
    return like;
  }

  async findAll() {
    const like = await this.matchesModel.find({});
    return like;
  }

  async findOne(id: string) {
    const like = await this.matchesModel.findOne({
      _id: id,
    });
    return like;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    return 'Update';
  }

  async remove(id: string) {
    return 'Delete';
  }
}
