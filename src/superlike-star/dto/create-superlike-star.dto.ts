import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString, IsNumber } from 'class-validator';

export class CreateSuperlikeStarDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'amount',
    example: 3,
  })
  amount: number;
}
