import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';

export class CreateDislikeUserDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: 'userDislikedId',
    example: '62846ff7dc8f605051b07c73',
  })
  userDislikedId: string;
}
