import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { updatePublicVarEmail } from 'src/shared/function-shared';
import { UserService } from '../../src/users/user.service';
import { ActionEnum } from '../../utils/constants/enum/action.enum';
import { Role } from '../../utils/constants/enum/role.enum';

export const permissionCode = 'permissionCode';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  private readonly logger = new Logger(RolesGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.getAllAndOverride<ActionEnum>(
      permissionCode,
      [context.getHandler(), context.getClass()],
    );

    this.logger.debug(`permission: ${permission}`);

    // Check permission in controller exists or not in ActionEnum
    // Có permission nhưng ko nằm trong list Action sẽ bị từ chối truy cập
    if (permission && Object.values(ActionEnum)?.indexOf(permission) === -1) {
      return false;
    }

    const request = context?.switchToHttp()?.getRequest();

    const user = request?.user;
    const body = request?.body;
    if (user) {
      updatePublicVarEmail(user.email);
      // Không có role sẽ từ chối truy cập
      if (!user.role) {
        return false;
      }

      this.logger.debug(`role: ${user.role}`);

      // Không có action ở func trong contronller cho phép truy cập vào func này
      if (!permission) {
        return true;
      }

      // Chỉ được tạo duy nhất General Manager
      // if (permission == ActionEnum.createAdminUser) {
      //   if (body?.role?.includes(Role.GeneralManager)) {
      //     if (this.userService.isOneUserRoleGeneralManager()) {
      //       return false;
      //     }
      //   }
      // }

      //Tất cả những Branch Manager được phép xem danh sách, nội dung khóa học,
      // if (
      //   user.role === Role.BranchManager &&
      //   permission == ActionEnum.getCourse
      // ) {
      //   return true;
      // }

      // Only General Manager can take action for AdminUser, Permission, GroupPermission
      // Tất cả permission nào trong route handle có tên AdminUser,Permission đều được accept
      if (
        user.role === Role.GeneralManager &&
        (permission.includes('AdminUser') || permission.includes('Permission'))
      ) {
        return true;
      }

      // Nếu Permission trong route handle trùng với role của user
      // và permission của user chứa permission của route handle
      if (user.permission.indexOf(permission) > -1) {
        // Tất cả những Branch Manager không được phép cập nhật, chỉnh sửa, xóa khóa học.
        // if (
        //   user.role === Role.BranchManager &&
        //   (permission == ActionEnum.deleteCourse ||
        //     permission == ActionEnum.updateCourse ||
        //     permission == ActionEnum.createCourse)
        // ) {
        //   return false;
        // }

        // check permission current access to router handle
        // Tất cả role ko là General Manager, mà trong route handle có tên AdminUser, Permission đều bị từ chối
        if (
          user.role !== Role.GeneralManager &&
          (permission.includes('AdminUser') ||
            permission.includes('Permission'))
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
