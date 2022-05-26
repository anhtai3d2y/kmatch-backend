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
import { GroupPermission } from './interfaces/group-permission.interface';
import { CreateGroupPermissionDto } from './dto/createGroupPermission.dto';
import { UpdateGroupPermissionDto } from './dto/updateGroupPermission.dto';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class GroupPermissionService {
  constructor(
    @Inject(forwardRef(() => PermissionService))
    private permissionService: PermissionService,
    @InjectModel('GroupPermission')
    private readonly groupPermissionModel: Model<GroupPermission>,
  ) {}

  // async getAllGroupPermission(): Promise<GroupPermission[]> {
  //   const query = [
  //     {
  //       $lookup: {
  //         from: 'permissions',
  //         let: { permissionId: '$permissionId' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $in: [{ $toString: '$_id' }, '$$permissionId'],
  //               },
  //             },
  //           },
  //           {
  //             $addFields: {
  //               moduleName: { $split: ['$permissionCode', '_'] },
  //             },
  //           },
  //           {
  //             $addFields: {
  //               moduleName: { $last: '$moduleName' },
  //             },
  //           },
  //           // group
  //           {
  //             $group: {
  //               _id: '$moduleName',
  //               permissionList: {
  //                 $push: {
  //                   _id: '$_id',
  //                   permissionName: '$permissionName',
  //                   permissionCode: '$permissionCode',
  //                 },
  //               },
  //             },
  //           },
  //           {
  //             $project: {
  //               moduleName: '$_id',
  //               _id: 0,
  //               permissionList: 1,
  //             },
  //           },
  //           { $sort: { moduleName: 1 } },
  //         ],
  //         as: 'permissionsList',
  //       },
  //     },
  //     {
  //       $sort: {
  //         role: 1,
  //       },
  //     },
  //     {
  //       $project: {
  //         permissionId: 0,
  //       },
  //     },
  //   ];

  //   return await this.groupPermissionModel.aggregate(query);
  // }

  async createGroupPermission(
    createGroupPermissionDto: CreateGroupPermissionDto,
  ): Promise<GroupPermission> {
    try {
      const createdGroupPermission = new this.groupPermissionModel(
        createGroupPermissionDto,
      );
      return await createdGroupPermission.save();
    } catch (e) {
      if (e.errors) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Please fill a valid GroupPermission`,
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

  async getGroupPermissionBydID(id: any): Promise<GroupPermission> {
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
    return this.groupPermissionModel.findOne({
      _id: id,
    });
  }

  async updateGroupPermission(
    id: any,
    gP: UpdateGroupPermissionDto,
  ): Promise<GroupPermission> {
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
    const updateGP: any = await this.groupPermissionModel.findById(id);
    if (!updateGP) {
      throw new HttpException(
        {
          error: 'ID_NOT_FOUND',
          message: 'common.ID_NOT_FOUND',
          statusCode: HttpStatus.NOT_FOUND,
        },
        404,
      );
    }
    if (gP.permissionId) {
      updateGP.permissionId = gP.permissionId;
    }
    if (gP.role) {
      updateGP.role = gP.role;
    }
    if (gP.additional) {
      updateGP.additional = gP.additional;
    }
    try {
      return await this.groupPermissionModel.findByIdAndUpdate(id, updateGP, {
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

  async deleteGroupPermission(id: any): Promise<GroupPermission> {
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
      const gP = await this.groupPermissionModel.findOneAndRemove({
        _id: id,
      });
      if (!gP) {
        throw new HttpException(
          {
            error: 'ID_NOT_FOUND',
            message: `common.ID_NOT_FOUND`,
            statusCode: HttpStatus.NOT_FOUND,
          },
          404,
        );
      }
      return gP;
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
            error: 'ID_NOT_FOUND',
            message: 'common.ID_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
          },
          400,
        );
      }
    }
  }
  async removePermissionID(id: any): Promise<GroupPermission> {
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
      const gP: any = await this.groupPermissionModel.find({
        permissionId: id,
      });
      gP.forEach(async (element) => {
        element.permissionId = element.permissionId.filter(
          (item) => item !== id,
        );
        await this.groupPermissionModel.findByIdAndUpdate(
          element._id,
          element,
          {
            new: true,
          },
        );
      });
      return gP;
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

  async getPermisionsByRole(role: string) {
    const pers = [];
    const gP = await this.groupPermissionModel.findOne({ role: role });
    if (gP) {
      for (let i = 0; i < gP.permissionId.length; i++) {
        const per = await this.permissionService.getPermisionByPermisionID(
          gP.permissionId[i],
        );
        if (per && per?.permissionCode) pers.push(per?.permissionCode);
      }
    }
    return pers;
  }

  async getPermissionsByRoleV2(role: string) {
    const query = [
      {
        $match: { role: role },
      },
      {
        $lookup: {
          from: 'permissions',
          let: { permissionId: '$permissionId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [{ $toString: '$_id' }, '$$permissionId'],
                },
              },
            },
            {
              $project: {
                createdAt: 0,
                updatedAt: 0,
              },
            },
          ],
          as: 'permissionsList',
        },
      },
      {
        $addFields: {
          permissionCode: '$permissionsList.permissionCode',
        },
      },
      {
        $project: {
          permissionId: 0,
          permissionsList: 0,
          updatedAt: 0,
          createdAt: 0,
        },
      },
    ];

    const gP = await this.groupPermissionModel.aggregate(query);
    return gP[0].permissionCode;
  }
}
