import { PartialType } from '@nestjs/swagger';
import { CreateInterestedGenderDto } from './create-interested-gender.dto';

export class UpdateInterestedGenderDto extends PartialType(CreateInterestedGenderDto) {}
