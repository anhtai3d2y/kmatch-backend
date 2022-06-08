import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';

export class CreateVerificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'email',
    example: 'anhtai3d2y@gmail.com',
  })
  email: string;
}
