import { PartialType } from '@nestjs/swagger';
import { CreateDislikeUserDto } from './create-dislike-user.dto';

export class UpdateDislikeUserDto extends PartialType(CreateDislikeUserDto) {}
