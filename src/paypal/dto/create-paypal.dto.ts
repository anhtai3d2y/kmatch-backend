import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';
import { Role } from 'utils/constants/enum/role.enum';

export class CreatePaypalDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @ApiProperty({ type: String, description: 'userId' })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'package',
    enum: Role,
    default: Role.KmatchPlus,
  })
  package: string;
}
