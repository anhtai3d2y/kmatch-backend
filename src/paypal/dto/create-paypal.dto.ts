import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';
import { Package } from 'utils/constants/enum/package.enum';
import { PackageType } from 'utils/constants/enum/packageType.enum';

export class CreatePaypalDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'type',
    enum: PackageType,
    default: PackageType.Role,
  })
  type: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'package',
    enum: Package,
    default: Package.KmatchPlus,
  })
  package: string;
}
