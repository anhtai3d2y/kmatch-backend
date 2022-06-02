import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';

export class CreateMatchDto {
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
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: 'otherUserId',
    example: '62846ff7dc8f605051b07c73',
  })
  otherUserId: string;
}
