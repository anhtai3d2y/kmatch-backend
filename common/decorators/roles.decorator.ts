import { SetMetadata } from '@nestjs/common';
import { permissionCode } from '../guard/roles.guard';
import { ActionEnum } from '../../utils/constants/enum/action.enum';

//export const Roles = (...role: Role[]) => SetMetadata(ROLES_KEY, role);
export const Permission = (action: ActionEnum) =>
  SetMetadata(permissionCode, action);
