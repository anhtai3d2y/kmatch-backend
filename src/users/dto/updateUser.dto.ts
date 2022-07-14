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
    required: false,
  })
  @IsEmail({}, { message: 'Email address is invalid' })
  @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
    message: 'MATHCES_EMAIL',
  })
  email: string;

  // @IsOptional()
  // @MinLength(6, { message: '6' })
  // @MaxLength(30, { message: '30' })
  // @ApiProperty({
  //   type: String,
  //   example: 'anhtai3d2y',
  //   description: 'Your password',
  // })
  // password: string;

  // @IsOptional()
  // @ApiProperty({
  //   type: String,
  //   example: 'Kmatch Basic',
  //   description: 'Your role',
  // })
  // // @IsIn(AdminRole, { message: AdminRole.toString() })
  // role: string;

  @ApiProperty({ type: String, enum: Gender })
  @IsOptional()
  @IsString()
  @IsIn(Gender, { message: Gender.toString() })
  gender: string;

  @Matches(/^(19|20)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/)
  @ApiProperty({ type: String, description: 'birthday', required: false })
  birthday: string;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Your latitude',
    example: 20.982353845604987,
    required: false,
  })
  latitude: number;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Your longitude',
    example: 105.78607285199709,
    required: false,
  })
  longitude: number;

  @IsOptional()
  @ApiProperty({
    type: String,
    example: '0983123124',
    description: 'Your Phone',
    required: false,
  })
  @IsMobilePhone('vi-VN')
  phonenumber: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Your gender show',
    enum: ['Male', 'Female', 'Other', 'Both'],
    default: 'Male',
    required: false,
  })
  genderShow: string;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Your min age',
    example: 16,
    required: false,
  })
  minAge: number;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Your max age',
    example: 30,
    required: false,
  })
  maxAge: number;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Your distance',
    example: 100,
    required: false,
  })
  distance: number;

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
