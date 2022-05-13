import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';
import { string } from 'yargs';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    type: String,
    example: 'anhtai3d2y@gmail.com',
    description: 'Your email',
  })
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must have 6 chars' })
  @MaxLength(30, { message: 'Password is too long. only 30 chars allow.' })
  @ApiProperty({
    type: String,
    example: 'anhtai3d2y',
    description: 'Your password',
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
