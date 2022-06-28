import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';

export class CreateLikeUserDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: 'userLikedId',
    example: '62846ff7dc8f605051b07c73',
  })
  userLikedId: string;
}
