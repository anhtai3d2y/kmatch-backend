import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Gender } from 'utils/constants/enum/gender.enum';

export class FileMetadata {
  @IsNotEmpty()
  @IsString()
  fieldname: string;

  @IsNotEmpty()
  @IsString()
  originalname: string;

  @IsNotEmpty()
  @IsString()
  encoding: string;

  @IsNotEmpty()
  @IsString()
  mimetype: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsString()
  @IsIn(Gender, { message: Gender.toString() })
  gender: string;
}

export class PhotoFields {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileMetadata)
  image: FileMetadata[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileMetadata)
  storageUrl: FileMetadata[];
}
