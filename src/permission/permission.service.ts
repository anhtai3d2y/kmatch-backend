import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectID } from 'mongodb';
import { Permission } from './interfaces/permission.interface';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissionDto } from './dto/updatePermission.dto';
import { GroupPermissionService } from '../group-permission/group-permission.service';

@Injectable()
export class PermissionService {
  groupPermissionModel: any;
  constructor(
    @Inject(forwardRef(() => GroupPermissionService))
    private readonly groupPermissionService: GroupPermissionService,
    @InjectModel('Permission')
    private readonly permissionModel: Model<Permission>,
  ) {}
  async getAllPermission(): Promise<Permission[]> {
    return this.permissionModel.find({});
  }

  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    try {
      const createdPer = new this.permissionModel(createPermissionDto);
      return await createdPer.save();
    } catch (e) {
      if (e.errors) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Please fill a valid role`,
            error: 'ValidatorError',
          },
          400,
        );
      } else if (e.name === 'MongoError') {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'common.CONFLICT',
            error: 'Conflict',
          },
          409,
        );
      } else {
        return e;
      }
    }
  }

  async getPermissionBydID(id: any): Promise<Permission> {
    if (!ObjectID.isValid(id)) {
      throw new HttpException(
        {
          error: 'ID_NOT_VALID',
          message: 'common.ID_NOT_VALID',
          statusCode: HttpStatus.NOT_FOUND,
        },
        400,
      );
    }
    return this.permissionModel.findOne({
      _id: id,
    });
  }

  async updatePermission(
    id: any,
    per: UpdatePermissionDto,
  ): Promise<Permission> {
    if (!ObjectID.isValid(id)) {
      throw new HttpException(
        {
          error: 'ID_NOT_VALID',
          message: 'common.ID_NOT_VALID',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        400,
      );
    }
    const updatedata: any = await this.permissionModel.findById(id);
    if (!updatedata) {
      throw new HttpException(
        {
          error: 'ID_NOT_FOUND',
          message: 'common.ID_NOT_FOUND',
          statusCode: HttpStatus.NOT_FOUND,
        },
        404,
      );
    }
    if (per.permissionName) {
      updatedata.permissionName = per.permissionName;
    }
    if (per.permissionCode) {
      updatedata.permissionCode = per.permissionCode;
    }
    try {
      return await this.permissionModel.findByIdAndUpdate(id, updatedata, {
        new: true,
      });
    } catch (e) {
      if (e.name === 'MongoError') {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'common.CONFLICT',
            error: 'Conflict',
          },
          409,
        );
      }
    }
  }
  async deletePermissionById(id: any): Promise<Permission> {
    if (!ObjectID.isValid(id)) {
      throw new HttpException(
        {
          error: 'ID_NOT_VALID',
          message: 'common.ID_NOT_VALID',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        400,
      );
    }
    try {
      const permission = await this.permissionModel.findOneAndRemove({
        _id: id,
      });
      await this.groupPermissionService.removePermissionID(id);
      if (!permission) {
        throw new HttpException(
          {
            error: 'ID_NOT_FOUND',
            message: 'common.ID_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
          },
          404,
        );
      }
      return permission;
    } catch (e) {
      if (e.message.error === 'NOT_FOUND') {
        throw new HttpException(
          {
            error: 'ID_NOT_FOUND',
            message: 'common.ID_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
          },
          404,
        );
      } else {
        throw new HttpException(
          {
            error: 'ID_NOT_VALID',
            message: 'common.ID_NOT_VALID',
            statusCode: HttpStatus.BAD_REQUEST,
          },
          400,
        );
      }
    }
  }

  async getPermisionByPermisionID(id: any) {
    if (!ObjectID.isValid(id)) {
      throw new HttpException(
        {
          error: 'ID_NOT_VALID',
          message: 'common.ID_NOT_VALID',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        400,
      );
    }
    try {
      const permission = await this.permissionModel.findOne({
        _id: id,
      });
      return permission;
    } catch (e) {
      if (e.message.error === 'NOT_FOUND') {
        throw new HttpException(
          {
            error: 'ID_NOT_FOUND',
            message: 'common.ID_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
          },
          404,
        );
      } else {
        throw new HttpException(
          {
            error: 'ID_NOT_VALID',
            message: 'common.ID_NOT_VALID',
            statusCode: HttpStatus.BAD_REQUEST,
          },
          400,
        );
      }
    }
  }
}
