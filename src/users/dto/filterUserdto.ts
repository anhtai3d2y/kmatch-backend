import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PagingDto } from 'src/shared/handling-paging/dto/paging.dto';
export class FilterUserDto extends PagingDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  textSearch: string;
}
