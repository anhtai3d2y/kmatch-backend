import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';
export class ChangePassDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @ApiProperty({
    type: String,
    description: 'oldPassword',
  })
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @ApiProperty({
    type: String,
    description: 'newPassword',
  })
  newPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @ApiProperty({
    type: String,
    description: 'confirmNewpassword',
  })
  confirmNewPassword: string;
}
