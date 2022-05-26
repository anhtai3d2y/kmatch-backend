import { Injectable } from '@nestjs/common';
import { CreateInterestedGenderDto } from './dto/create-interested-gender.dto';
import { UpdateInterestedGenderDto } from './dto/update-interested-gender.dto';

@Injectable()
export class InterestedGenderService {
  create(createInterestedGenderDto: CreateInterestedGenderDto) {
    return 'This action adds a new interestedGender';
  }

  findAll() {
    return `This action returns all interestedGender`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interestedGender`;
  }

  update(id: number, updateInterestedGenderDto: UpdateInterestedGenderDto) {
    return `This action updates a #${id} interestedGender`;
  }

  remove(id: number) {
    return `This action removes a #${id} interestedGender`;
  }
}
