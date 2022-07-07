import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PagingDto } from 'src/shared/handling-paging/dto/paging.dto';
export class NewsFeedFilterDto extends PagingDto {
  @ApiProperty({
    type: String,
    enum: ['Male', 'Female', 'Other', 'Both'],
    default: 'Male',
    required: false,
  })
  @IsOptional()
  @IsString()
  gender: string;

  @ApiProperty({
    type: Number,
    default: 16,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minAge: number;

  @ApiProperty({
    type: Number,
    default: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxAge: number;

  @ApiProperty({
    type: Number,
    default: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  distance: number;
}
