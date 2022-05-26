import { forwardRef, Module } from '@nestjs/common';
import { GroupPermissionService } from './group-permission.service';
import { GroupPermissionController } from './group-permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { groupPermissionSchema } from './schemas/group-permission.schema';
import { PermissionModule } from '../permission/permission.module';
import { RolesGuard } from '../../common/guard/roles.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GroupPermission', schema: groupPermissionSchema },
    ]),
    forwardRef(() => PermissionModule),
  ],
  controllers: [GroupPermissionController],
  providers: [GroupPermissionService, RolesGuard],
  exports: [GroupPermissionService],
})
export class GroupPermissionModule {}
