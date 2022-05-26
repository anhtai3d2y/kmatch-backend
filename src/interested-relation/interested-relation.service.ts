import { Injectable } from '@nestjs/common';
import { CreateInterestedRelationDto } from './dto/create-interested-relation.dto';
import { UpdateInterestedRelationDto } from './dto/update-interested-relation.dto';

@Injectable()
export class InterestedRelationService {
  create(createInterestedRelationDto: CreateInterestedRelationDto) {
    return 'This action adds a new interestedRelation';
  }

  findAll() {
    return `This action returns all interestedRelation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interestedRelation`;
  }

  update(id: number, updateInterestedRelationDto: UpdateInterestedRelationDto) {
    return `This action updates a #${id} interestedRelation`;
  }

  remove(id: number) {
    return `This action removes a #${id} interestedRelation`;
  }
}
