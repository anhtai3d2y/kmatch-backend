import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Bcrypt from 'bcryptjs';
import * as bcrypt from 'bcryptjs';
import { User } from './interfaces/user.interfaces';
import { ObjectID } from 'mongodb';
import { PagingService } from '../shared/handling-paging/paging.service';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { uuid } from '../../utils/util';
import * as fs from 'fs';
import { deleteFile, uploadFile } from 'utils/cloudinary';
import { SendMailService } from 'src/shared/send-mail/send-mail.service';
import { avatarMale } from 'images/avatarMale';
import { avatarFemale } from 'images/avatarFemale';
import { nameMale } from 'images/nameMale';
import { nameFemale } from 'images/nameFemale';
import { LikeUsers } from 'src/like-users/interfaces/like-users.interfaces';
import { DislikeUsers } from 'src/dislike-users/interfaces/dislike-users.interfaces';
import { SuperlikeUsers } from 'src/superlike-users/interfaces/superlike-users.interfaces';

export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('LikeUsers')
    private readonly likeUserModel: Model<LikeUsers>,
    @InjectModel('DislikeUsers')
    private readonly dislikeUserModel: Model<DislikeUsers>,
    @InjectModel('SuperlikeUsers')
    private readonly superlikeUserModel: Model<SuperlikeUsers>,
    private pagingService: PagingService,
    private readonly sendEmail: SendMailService,
  ) {}

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

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

  async getUsersNewsfeed(paging, user): Promise<User | any> {
    const me = await this.userModel.findOne({ _id: user._id });
    const myLocation = me.location;
    const currentYear = new Date().getFullYear();
    const userLikedIds = await this.getLikedUserIds(user);
    const userDislikedIds = await this.getDislikedUserIds(user);
    const userSuperlikedIds = await this.getSuperlikedUserIds(user);
    const ids = [...userLikedIds, ...userDislikedIds, ...userSuperlikedIds].map(
      (id) => {
        return new ObjectID(id);
      },
    );
    let users = await this.userModel.aggregate([
      {
        $match: {
          _id: { $ne: user._id },
        },
      },
      {
        $match: {
          _id: { $nin: ids },
        },
      },
      {
        $project: {
          password: 0,
          currentHashedRefreshToken: 0,
          permission: 0,
          phonenumber: 0,
          createdAt: 0,
          updatedAt: 0,
          verification: 0,
        },
      },
      // { $limit: 20 },
    ]);
    users = users.filter((user) => {
      const age = currentYear - parseInt(user.birthday.split('/')[0]);
      user.age = age;
      const distance = this.distance(
        myLocation.latitude,
        myLocation.longitude,
        user.location.latitude,
        user.location.longitude,
      );
      user.distance =
        distance >= 1
          ? Math.round(distance * 10) / 10 + ' km'
          : Math.round(distance * 1000) + ' m';
      // distance <= 20 && console.log(user.distance);
      return true;
    });
    // console.log('total: ', users.length);
    paging.limit = 5;
    return this.pagingService.controlPaging(users, paging);
  }

  async createUser(payload: any, file: any) {
    const fileName = `./images/${uuid()}.png`;
    await fs.createWriteStream(fileName).write(file.buffer);
    const fileUploaded = await uploadFile(fileName);
    fs.unlink(fileName, (err) => {
      if (err) console.log('err: ', err);
    });
    const salt = await Bcrypt.genSalt(10);
    const password = await Bcrypt.hash(payload.password, salt);
    const user = await this.userModel.create({
      ...payload,
      password,
      avatar: {
        publicId: fileUploaded.public_id,
        secureURL: fileUploaded.secure_url,
      },
    });
    const emailPassword = {
      email: payload.email,
      password: payload.password,
    };
    await this.sendEmail.sendUserPass(emailPassword);
    user.password = null;
    return user;
  }

  async generateUsers() {
    const salt = await Bcrypt.genSalt(10);
    const password = await Bcrypt.hash('anhtai3d2y', salt);
    const avatar = {
      Male: avatarMale,
      Female: avatarFemale,
    };
    const name = {
      Male: nameMale,
      Female: nameFemale,
    };
    const gender = ['Male', 'Female'];
    for (let i = 1; i <= 3000; i++) {
      const genderPicked = gender[Math.floor(Math.random() * gender.length)];
      const birthdayPicked =
        Math.floor(Math.random() * (2006 - 1992) + 1992) +
        '/' +
        Math.floor(Math.random() * (12 - 1) + 1) +
        '/' +
        Math.floor(Math.random() * (28 - 1) + 1);
      const phonenumberPicked =
        '0' + Math.floor(Math.random() * (999999999 - 100000000) + 100000000);
      const namePicked =
        name[genderPicked][
          Math.floor(Math.random() * name[genderPicked].length)
        ];
      const avatarPicked =
        avatar[genderPicked][
          Math.floor(Math.random() * avatar[genderPicked].length)
        ];
      const latitude = 20 + Math.random() * (1.4 - 0.5) + 0.5;
      const longitude = 100 + Math.random() * (6.4 - 5.2) + 5.2;
      const user = {
        email: `user${i}@gmail.com`,
        name: namePicked,
        gender: genderPicked,
        password,
        avatar: {
          publicId: avatarPicked,
          secureURL: `https://res.cloudinary.com/anhtai3d2y/image/upload/v1652849219/kmatch/${avatarPicked}.jpg`,
        },
        role: 'Kmatch Basic',
        birthday: birthdayPicked,
        location: {
          latitude: latitude,
          longitude: longitude,
        },
        phonenumber: phonenumberPicked,
      };
      await this.userModel.create(user);
      console.log('user #', i);
    }

    return 'ok';
  }

  // Find user details with email id
  async findOne(email: string): Promise<User | null> {
    return await this.userModel.findOne(
      { email },
      { createdAt: 0, updatedAt: 0 },
    );
  }

  async updateUser(user, userInfo: UpdateUserDto, file): Promise<User> {
    const updatedata: any = await this.userModel.findById(user._id);
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
    if (userInfo.phonenumber) {
      updatedata.phonenumber = userInfo.phonenumber;
    }
    if (userInfo.gender) {
      updatedata.gender = userInfo.gender;
    }
    if (userInfo.latitude) {
      updatedata.location.latitude = userInfo.latitude;
    }
    if (userInfo.longitude) {
      updatedata.location.longitude = userInfo.longitude;
    }
    if (file) {
      if (updatedata.avatar.publicId) {
        await deleteFile(updatedata.avatar.publicId);
      }
      const fileName = `./images/${uuid()}.png`;
      fs.createWriteStream(fileName).write(file.buffer);
      const fileUploaded = await uploadFile(fileName);
      fs.unlink(fileName, (err) => {
        if (err) console.log(err);
      });
      updatedata.avatar = {
        publicId: fileUploaded.public_id,
        secureURL: fileUploaded.secure_url,
      };
    }

    try {
      const data = await this.userModel.findByIdAndUpdate(user._id, updatedata);
      return data;
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
  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      currentHashedRefreshToken,
    });
  }

  async getLikedUserIds(user) {
    const likeUser = await this.likeUserModel.aggregate([
      {
        $match: {
          userId: user._id.toString(),
        },
      },
      {
        $group: {
          _id: '$userId',
          userLikedId: { $push: '$userLikedId' },
        },
      },
    ]);
    return likeUser[0] ? likeUser[0]?.userLikedId : [];
  }

  async getDislikedUserIds(user) {
    const dislikeUser = await this.dislikeUserModel.aggregate([
      {
        $match: {
          userId: user._id.toString(),
        },
      },
      {
        $group: {
          _id: '$userId',
          userDislikedId: { $push: '$userDislikedId' },
        },
      },
    ]);
    return dislikeUser[0] ? dislikeUser[0]?.userDislikedId : [];
  }

  async getSuperlikedUserIds(user) {
    const superlikeUser = await this.superlikeUserModel.aggregate([
      {
        $match: {
          userId: user._id.toString(),
        },
      },
      {
        $group: {
          _id: '$userId',
          userSuperlikedId: { $push: '$userSuperlikedId' },
        },
      },
    ]);
    return superlikeUser[0] ? superlikeUser[0]?.userSuperlikedId : [];
  }

  distance(lat1, lon1, lat2, lon2) {
    // Degrees to radians.
    lon1 = (lon1 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    // Haversine formula
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    const c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers.
    // Use 3956 for miles.
    const r = 6371;

    // Calculate the result.
    return c * r;
  }
}
