import { forwardRef, Module } from '@nestjs/common';
import { Permission1Service } from './premission1.service';
import { Premission1Controller } from './premission1.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { permissionSchema } from './schemas/permission.schema';
import { GroupPermissionModule } from 'src/group-permission/group-permission.module';
import { PermissionService } from 'src/permission/permission.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Permission', schema: permissionSchema },
    ]),
    forwardRef(() => GroupPermissionModule),
  ],
  controllers: [Premission1Controller],
  providers: [Permission1Service, PermissionService],
  exports: [Permission1Service],
})
export class Premission1Module {}
