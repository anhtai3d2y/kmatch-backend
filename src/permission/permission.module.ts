import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupPermissionModule } from '../group-permission/group-permission.module';
import { PermissionService } from './permission.service';
import { permissionSchema } from './schemas/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Permission', schema: permissionSchema },
    ]),
    forwardRef(() => GroupPermissionModule),
  ],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
