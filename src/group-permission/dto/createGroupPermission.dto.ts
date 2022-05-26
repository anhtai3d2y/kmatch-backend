import { IsArray, IsIn, IsNotEmpty } from 'class-validator';
import { AdminRole } from '../../../utils/constants/enum/adminRole.enum';

export class CreateGroupPermissionDto {
  @IsIn(AdminRole, { message: AdminRole.toString() })
  @IsNotEmpty({ message: 'IsNotEmpty' })
  role: string;

  additional: string;

  @IsNotEmpty()
  @IsArray()
  permissionId: string[];
}
