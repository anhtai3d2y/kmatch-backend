import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsIn,
  IsString,
  ValidateIf,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Gender } from 'utils/constants/enum/gender.enum';
import { Role } from 'utils/constants/enum/role.enum';

export class AddUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: 'password', required: false })
  password: string;

  @ApiProperty({ type: String, enum: Gender, required: false })
  @IsOptional()
  @IsString()
  @IsIn(Gender, { message: Gender.toString() })
  gender: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: '6' })
  @MaxLength(30, { message: '30' })
  @ApiProperty({ type: String, description: 'phonenumber' })
  phonenumber: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({
  //   type: String,
  //   description: 'role',
  //   enum: Role,
  //   default: Role.KmatchBasic,
  // })
  // role: string;

  @IsNotEmpty()
  @Matches(/^(19|20)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/)
  @ApiProperty({ type: String, description: 'birthday' })
  birthday: string;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Your latitude',
    example: 20.982353845604987,
  })
  latitude: number;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Your longitude',
    example: 105.78607285199709,
  })
  longitude: number;

  @ApiProperty({
    type: String,
    format: 'binary',
    description: 'avatar',
    required: false,
  })
  @IsOptional()
  avatar?: string;
}
