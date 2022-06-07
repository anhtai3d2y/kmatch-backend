import { IsArray, IsIn, IsNotEmpty } from 'class-validator';
import { AdminRole } from '../../../utils/constants/enum/adminRole.enum';
import { IsOptional } from 'class-validator';
import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { Role } from 'utils/constants/enum/role.enum';

export class UpdateGroupPermissionDto {
  @IsIn(AdminRole, { message: AdminRole.toString() })
  @IsNotEmpty({ message: 'IsNotEmpty' })
  @ApiProperty({
    type: String,
    description: 'role',
    enum: Role,
    default: Role.KmatchBasic,
  })
  role: string;

  @ApiProperty({
    type: String,
    description: 'additional',
    example: `This is the role for ${Role.KmatchBasic} package.`,
  })
  additional: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      example: '62985fb29e4491027eedaa60',
    },
  })
  permissionId: string[];
}
