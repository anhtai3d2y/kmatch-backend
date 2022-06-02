import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateSuperlikeStarDto } from './create-superlike-star.dto';

export class UpdateSuperlikeStarDto extends PartialType(
  CreateSuperlikeStarDto,
) {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: 'userId',
    example: '627e17990d52eb29d86831cd',
  })
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'amount',
    example: 100,
  })
  amount: number;
}
