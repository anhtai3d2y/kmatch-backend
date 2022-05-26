import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsIn,
  IsString,
  ValidateIf,
  Matches,
} from 'class-validator';
import { Gender } from 'utils/constants/enum/gender.enum';

export class CreatePaypalDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'userId' })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'context' })
  context: string;
}
