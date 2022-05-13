import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Bcrypt from 'bcryptjs';
import * as bcrypt from 'bcryptjs';
import { User } from './interfaces/user.interfaces';
import { Role } from '../../utils/constants/enum/role.enum';
import { ObjectID } from 'mongodb';
import { PagingService } from '../shared/handling-paging/paging.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';

export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private pagingService: PagingService,
  ) {}

  async getById(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  async getAllOrSearchUser(search: string): Promise<User | any> {
    const users = await this.userModel.aggregate([
      {
        $project: {
          password: 0,
          currentHashedRefreshToken: 0,
        },
      },
    ]);
    return users;
  }

  async createUser(payload: any) {
    const salt = await Bcrypt.genSalt(10);
    const password = await Bcrypt.hash(payload.password, salt);
    const user = await this.userModel.create({
      ...payload,
      password,
    });
    user.password = null;
    return user;
  }

  // Find user details with email id
  async findOne(email: string): Promise<User | null> {
    return await this.userModel.findOne(
      { email },
      { createdAt: 0, updatedAt: 0 },
    );
  }

  async updateUser(id: any, userInfo: UpdateUserDto): Promise<User> {
    if (!ObjectID.isValid(id)) {
      throw new HttpException(
        {
          error: 'ID_NOT_VALID',
          message: `common.ID_NOT_VALID`,
          statusCode: HttpStatus.BAD_REQUEST,
        },
        400,
      );
    }

    const updatedata: any = await this.userModel.findById(id);
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

    if (userInfo.name) {
      updatedata.name = userInfo.name;
    }
    // if (userInfo?.image) {
    //   if (updatedata?.image) {
    //     await this.gCloudStorageService.deleteFile(updatedata.image);
    //   }
    //   updatedata.image = userInfo.image;
    // }
    if (userInfo.email) {
      updatedata.email = userInfo.email;
    }
    if (userInfo.password) {
      const salt = await Bcrypt.genSalt(10);
      updatedata.password = await Bcrypt.hash(userInfo.password, salt);
    }
    if (userInfo.role) {
      updatedata.role = userInfo.role;
    }
    if (userInfo.phone) {
      updatedata.phone = userInfo.phone;
    }
    if (userInfo.role === Role.GeneralManager) {
      updatedata.branchId = [];
    }
    if (userInfo.gender) {
      updatedata.gender = userInfo.gender;
    }

    try {
      return await this.userModel.findByIdAndUpdate(id, updatedata, {
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
      } else {
        throw new HttpException(
          {
            error: 'ID_NOT_FOUND',
            message: 'common.ID_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
          },
          404,
        );
      }
    }
  }
}
