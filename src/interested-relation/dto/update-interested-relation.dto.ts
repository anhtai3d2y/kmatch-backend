import { PartialType } from '@nestjs/swagger';
import { CreateInterestedRelationDto } from './create-interested-relation.dto';

export class UpdateInterestedRelationDto extends PartialType(CreateInterestedRelationDto) {}
