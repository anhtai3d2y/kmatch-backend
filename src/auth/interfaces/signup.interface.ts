import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsMobilePhone,
  IsString,
  IsOptional,
  IsMongoId,
  IsArray,
  IsIn,
} from 'class-validator';
import { Gender } from 'utils/constants/enum/gender.enum';

export class RegistrationRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Pham Duy Tai',
    description: 'Your name',
  })
  name: String;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'anhtai3d2y@gmail.com',
    description: 'Your email',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: '6' })
  @MaxLength(30, { message: '30' })
  @ApiProperty({
    type: String,
    example: 'QKf812=!#$@LFAakf9',
    description: 'Your password',
  })
  password: string;

  @IsMobilePhone('vi-VN')
  @IsString()
  @ApiProperty({
    type: String,
    example: '0983123124',
    description: 'Your Phone',
  })
  phone: string;

  @ApiProperty({ type: String, enum: Gender })
  @IsOptional()
  @IsString()
  @IsIn(Gender, { message: Gender.toString() })
  gender: string;
}
