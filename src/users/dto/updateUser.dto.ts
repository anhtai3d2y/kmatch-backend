import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsMobilePhone,
  IsString,
  IsIn,
} from 'class-validator';
import { Gender } from 'utils/constants/enum/gender.enum';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    example: '627dd7d36f82e349327bf1a1',
    description: 'Your id',
    required: true,
  })
  id: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'Pham Duy Tai',
    description: 'Your name',
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'anhtai3d2y@gmail.com',
    description: 'Your email',
  })
  @IsEmail({}, { message: 'Email address is invalid' })
  @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
    message: 'MATHCES_EMAIL',
  })
  email: string;

  @IsOptional()
  @MinLength(6, { message: '6' })
  @MaxLength(30, { message: '30' })
  @ApiProperty({
    type: String,
    example: 'anhtai3d2y',
    description: 'Your password',
  })
  password: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'Branch Manager',
    description: 'Your role',
  })
  // @IsIn(AdminRole, { message: AdminRole.toString() })
  role: string;

  @ApiProperty({ type: String, enum: Gender })
  @IsOptional()
  @IsString()
  @IsIn(Gender, { message: Gender.toString() })
  gender: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    example: '0983123124',
    description: 'Your Phone',
  })
  @IsMobilePhone('vi-VN')
  phonenumber: string;

  @ApiProperty({
    type: String,
    format: 'binary',
    description: 'avatar',
    required: false,
  })
  @IsOptional()
  avatar?: string;

  permission?: string[];
}
