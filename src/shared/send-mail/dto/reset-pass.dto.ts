import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';
export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'email',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'verificationCode',
  })
  verificationCode: string;

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
