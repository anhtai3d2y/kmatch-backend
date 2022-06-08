import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';

export class GetVerificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'email',
    example: 'anhtai3d2y@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'verificationCode',
    example: '123456',
  })
  verificationCode: string;
}
