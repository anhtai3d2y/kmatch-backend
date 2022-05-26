import { PartialType } from '@nestjs/swagger';
import { CreateLikeUserDto } from './create-like-user.dto';

export class UpdateLikeUserDto extends PartialType(CreateLikeUserDto) {}
