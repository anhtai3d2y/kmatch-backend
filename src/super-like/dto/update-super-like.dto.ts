import { PartialType } from '@nestjs/swagger';
import { CreateSuperLikeDto } from './create-super-like.dto';

export class UpdateSuperLikeDto extends PartialType(CreateSuperLikeDto) {}
