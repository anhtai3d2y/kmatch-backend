import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsIn,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class PagingDto {
  @ApiProperty({
    type: String,
    description: 'sortBy',
    required: false,
    example: '{"name": 1, "age": -1}',
  })
  @IsOptional()
  sortBy: string;

  @ApiProperty({
    type: String,
    enum: ['true'],
    description: 'nolimit',
    required: false,
  })
  @IsOptional()
  @IsIn(['true'])
  @IsBooleanString()
  nolimit: string;

  @ApiProperty({ type: Number, description: 'page', required: false })
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiProperty({ type: Number, description: 'limit', required: false })
  @IsOptional()
  @IsNumberString()
  limit: number;
}
