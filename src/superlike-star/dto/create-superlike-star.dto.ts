import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString, IsNumber } from 'class-validator';

export class CreateSuperlikeStarDto {
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
