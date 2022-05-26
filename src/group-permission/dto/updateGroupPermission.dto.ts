import { IsArray, IsIn } from 'class-validator';
import { AdminRole } from '../../../utils/constants/enum/adminRole.enum';
import { IsOptional } from 'class-validator';

export class UpdateGroupPermissionDto {
  @IsOptional()
  @IsIn(AdminRole, { message: AdminRole.toString() })
  role: string;

  @IsOptional()
  additional: string;

  @IsOptional()
  @IsArray({ message: 'IsArray_permissionId' })
  permissionId: string[];
}
