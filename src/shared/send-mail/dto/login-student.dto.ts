import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
export class LoginStudentDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'email',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @ApiProperty({
    type: String,
    description: 'password',
  })
  password: string;
}

export interface LoginResponse {
  readonly token: string;
  readonly data: any;
  readonly success: boolean;
  readonly message: string;
}

export interface ResponseData {
  readonly success: boolean;
  readonly message: string;
  readonly data: any;
}
