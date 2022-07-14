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
import { calculateAge, uuid } from '../../utils/util';
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
import { SuperlikeStar } from 'src/superlike-star/interfaces/superlike-star.interfaces';
import { Boots } from 'src/boots/interfaces/boots.interfaces';
import { Role } from 'utils/constants/enum/role.enum';
import { filter } from 'rxjs';
import { Cron } from '@nestjs/schedule';

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
    @InjectModel('SuperlikeStar')
    private readonly superlikeStarModel: Model<SuperlikeStar>,
    @InjectModel('Boots')
    private readonly bootsModel: Model<Boots>,
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

  async getUserProfile(user): Promise<User | any> {
    const users = await this.userModel.aggregate([
      {
        $match: {
          _id: user._id,
        },
      },
      {
        $project: {
          password: 0,
          currentHashedRefreshToken: 0,
        },
      },
    ]);
    users[0].boots = user.boots - Date.now() < 0 ? 0 : user.boots - Date.now();
    const userStar = await this.superlikeStarModel.findOne({
      userId: user._id,
    });
    const userBoots = await this.bootsModel.findOne({
      userId: user._id,
    });
    if (userStar) {
      users[0].starAmount = userStar.amount;
    } else {
      await this.superlikeStarModel.create({
        userId: user._id,
        amount: 0,
      });
      users[0].starAmount = 0;
    }
    if (userBoots) {
      users[0].bootsAmount = userBoots.amount;
    } else {
      await this.bootsModel.create({
        userId: user._id,
        amount: 0,
      });
      users[0].bootsAmount = 0;
    }
    users[0].age = calculateAge(users[0].birthday);
    return users;
  }

  async getUsersNewsfeed(filter, user): Promise<User | any> {
    const genderRequired = filter.gender;
    const minAgeRequired = parseInt(filter.minAge);
    const maxAgeRequired = parseInt(filter.maxAge);
    const distanceRequired = parseInt(filter.distance);

    const me = await this.userModel.findOne({ _id: user._id });
    const myLocation = me.mylocation;
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
      { $addFields: { userId: { $toString: '$_id' } } },
      {
        $lookup: {
          from: 'superlikeusers',
          localField: 'userId',
          foreignField: 'userSuperlikedId',
          as: 'superlikes',
        },
      },
      { $addFields: { superlikes: { $size: '$superlikes' } } },
      {
        $sort: {
          boots: -1,
          superlikes: -1,
        },
      },
    ]);
    users = users.filter((user) => {
      const age = calculateAge(user.birthday);
      user.age = age;
      user.boots = user.boots - Date.now() < 0 ? 0 : user.boots - Date.now();
      const distance = this.distance(
        myLocation.latitude,
        myLocation.longitude,
        user.mylocation.latitude,
        user.mylocation.longitude,
      );
      const isGenderOk =
        genderRequired === 'Both' || genderRequired === user.gender;
      const isAgeOk = age >= minAgeRequired && age <= maxAgeRequired;
      const isDistanceOk = distance <= distanceRequired;
      user.distance =
        distance >= 1
          ? Math.round(distance * 10) / 10 + ' km'
          : Math.round(distance * 1000) + ' m';
      return isGenderOk && isAgeOk && isDistanceOk;
    });
    filter.limit = 5;
    return this.pagingService.controlPaging(users, filter);
  }

  async getUsersRanking(paging, userRequest): Promise<User | any> {
    const currentYear = new Date().getFullYear();
    let users = await this.userModel.aggregate([
      { $addFields: { userId: { $toString: '$_id' } } },
      {
        $lookup: {
          from: 'superlikeusers',
          localField: 'userId',
          foreignField: 'userSuperlikedId',
          as: 'superlikes',
        },
      },
      { $addFields: { superlikes: { $size: '$superlikes' } } },
      {
        $lookup: {
          from: 'superlikestars',
          localField: 'userId',
          foreignField: 'userId',
          as: 'superlikeStar',
        },
      },
      {
        $unwind: { path: '$superlikeStar' },
      },
      { $addFields: { superlikeStar: '$superlikeStar.amount' } },
      {
        $project: {
          password: 0,
          currentHashedRefreshToken: 0,
          permission: 0,
          phonenumber: 0,
          createdAt: 0,
          updatedAt: 0,
          verification: 0,
          mylocation: 0,
          email: 0,
          boots: 0,
          userId: 0,
        },
      },
      {
        $sort: JSON.parse(paging.sortBy),
      },
    ]);
    users = users.filter((user) => {
      const age = currentYear - parseInt(user.birthday.split('/')[0]);
      user.age = age;
      user.boots = user.boots - Date.now() < 0 ? 0 : user.boots - Date.now();
      user.isMe = user._id.toString() === userRequest._id.toString();
      if (paging.sortBy === '{"superlikes": -1, "superlikeStar": -1}') {
        return user.superlikes > 0;
      } else {
        return user.superlikeStar > 0;
      }
    });
    paging.limit = 100;
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
      role: Role.KmatchBasic,
      avatar: {
        publicId: fileUploaded.public_id,
        secureURL: fileUploaded.secure_url,
      },
      genderShow: 'Both',
      minAge: 16,
      maxAge: 30,
      distance: 100,
      mylocation: {
        latitude: parseFloat(payload.latitude),
        longitude: parseFloat(payload.longitude),
      },
      boots: Date.now(),
    });
    const emailPassword = {
      email: payload.email,
      password: payload.password,
    };
    await this.sendEmail.sendUserPass(emailPassword);
    user.password = null;
    await this.superlikeStarModel.create({
      userId: user._id.toString(),
      amount: 0,
    });
    await this.bootsModel.create({
      userId: user._id.toString(),
      amount: 0,
    });
    return user;
  }

  async generateUsers() {
    const salt = await Bcrypt.genSalt(10);
    const password = await Bcrypt.hash('anhtai3d2y', salt);
    const avatar = {
      Male: avatarMale,
      Female: avatarFemale,
      Other: [...avatarMale, ...avatarFemale],
    };
    const name = {
      Male: nameMale,
      Female: nameFemale,
      Other: [...nameMale, ...nameFemale],
    };
    const gender = ['Male', 'Female', 'Other'];
    for (let i = 1; i <= 1000; i++) {
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
      const bootsPicked = Math.floor(Math.random() * (7200000 - 0) + 0);
      const bootsAmount = Math.floor(Math.random() * (10000 - 0) + 0);
      const superlikeStarAmount = Math.floor(Math.random() * (10000 - 0) + 0);
      const latitude = 20 + Math.random() * (1.4 - 0.5) + 0.5;
      const longitude = 100 + Math.random() * (6.4 - 5.2) + 5.2;
      const user = {
        email: `user${i}@gmail.com`,
        name: namePicked,
        gender: genderPicked,
        password,
        avatar: {
          publicId: avatarPicked,
          secureURL: `https://res.cloudinary.com/anhtai3d2y/image/upload/q_20/v1652849219/kmatch/${avatarPicked}.jpg`,
        },
        role: 'Kmatch Basic',
        birthday: birthdayPicked,
        mylocation: {
          latitude: latitude,
          longitude: longitude,
        },
        phonenumber: phonenumberPicked,
        boots: Date.now() + bootsPicked,
        genderShow: 'Both',
        minAge: 16,
        maxAge: 30,
        distance: 100,
      };
      const data = await this.userModel.create(user);
      await this.bootsModel.create({
        userId: data._id.toString(),
        amount: bootsAmount,
      });
      await this.superlikeStarModel.create({
        userId: data._id.toString(),
        amount: superlikeStarAmount,
      });
      console.log('user #', i);
    }

    return 'ok';
  }

  async clearUsers() {
    const mainUser = await this.userModel.findOne({
      email: 'anhtai3d2y@gmail.com',
    });
    const data = await this.userModel.deleteMany({
      email: { $ne: mainUser.email },
    });
    await this.superlikeStarModel.deleteMany({
      userId: { $ne: mainUser._id.toString() },
    });
    await this.bootsModel.deleteMany({
      userId: { $ne: mainUser._id.toString() },
    });
    return data;
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
    // if (userInfo.password) {
    //   const salt = await Bcrypt.genSalt(10);
    //   updatedata.password = await Bcrypt.hash(userInfo.password, salt);
    // }
    // if (userInfo.role) {
    //   updatedata.role = userInfo.role;
    // }
    if (userInfo.phonenumber) {
      updatedata.phonenumber = userInfo.phonenumber;
    }
    if (userInfo.gender) {
      updatedata.gender = userInfo.gender;
    }
    if (userInfo.birthday) {
      updatedata.birthday = userInfo.birthday;
    }
    if (userInfo.latitude) {
      updatedata.mylocation.latitude = userInfo.latitude;
    }
    if (userInfo.longitude) {
      updatedata.mylocation.longitude = userInfo.longitude;
    }
    if (userInfo.genderShow) {
      updatedata.genderShow = userInfo.genderShow;
    }
    if (userInfo.minAge) {
      updatedata.minAge = userInfo.minAge;
    }
    if (userInfo.maxAge) {
      updatedata.maxAge = userInfo.maxAge;
    }
    if (userInfo.distance) {
      updatedata.distance = userInfo.distance;
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

  // @Cron('*/5 * * * * *')
  @Cron('0 0 1 * *')
  async cronJobFreeBoots() {
    let plusUsers = await this.userModel.aggregate([
      {
        $match: {
          role: Role.KmatchPlus,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    plusUsers = plusUsers.map((user) => user._id.toString());
    const plusBoots = await this.bootsModel.find({
      userId: { $in: plusUsers },
    });
    for (let i = 0; i < plusBoots.length; i++) {
      plusBoots[i].amount = plusBoots[i].amount + 1;
      await this.bootsModel.findByIdAndUpdate(plusBoots[i]._id, plusBoots[i]);
    }

    let goldUsers = await this.userModel.aggregate([
      {
        $match: {
          role: Role.KmatchGold,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    goldUsers = goldUsers.map((user) => user._id.toString());
    const goldBoots = await this.bootsModel.find({
      userId: { $in: goldUsers },
    });
    for (let i = 0; i < goldBoots.length; i++) {
      goldBoots[i].amount = goldBoots[i].amount + 3;
      await this.bootsModel.findByIdAndUpdate(goldBoots[i]._id, goldBoots[i]);
    }

    let platinumUsers = await this.userModel.aggregate([
      {
        $match: {
          role: Role.KmatchPlatinum,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    platinumUsers = platinumUsers.map((user) => user._id.toString());
    const platinumBoots = await this.bootsModel.find({
      userId: { $in: platinumUsers },
    });
    for (let i = 0; i < platinumBoots.length; i++) {
      platinumBoots[i].amount = platinumBoots[i].amount + 5;
      await this.bootsModel.findByIdAndUpdate(
        platinumBoots[i]._id,
        platinumBoots[i],
      );
    }
  }

  @Cron('0 0 * * 0')
  async cronJobFreeStars() {
    let plusUsers = await this.userModel.aggregate([
      {
        $match: {
          role: Role.KmatchPlus,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    plusUsers = plusUsers.map((user) => user._id.toString());
    const plusStars = await this.superlikeStarModel.find({
      userId: { $in: plusUsers },
    });
    for (let i = 0; i < plusStars.length; i++) {
      plusStars[i].amount = plusStars[i].amount + 1;
      await this.superlikeStarModel.findByIdAndUpdate(
        plusStars[i]._id,
        plusStars[i],
      );
    }

    let goldUsers = await this.userModel.aggregate([
      {
        $match: {
          role: Role.KmatchGold,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    goldUsers = goldUsers.map((user) => user._id.toString());
    const goldStars = await this.superlikeStarModel.find({
      userId: { $in: goldUsers },
    });
    for (let i = 0; i < goldStars.length; i++) {
      goldStars[i].amount = goldStars[i].amount + 3;
      await this.superlikeStarModel.findByIdAndUpdate(
        goldStars[i]._id,
        goldStars[i],
      );
    }

    let platinumUsers = await this.userModel.aggregate([
      {
        $match: {
          role: Role.KmatchPlatinum,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    platinumUsers = platinumUsers.map((user) => user._id.toString());
    const platinumStars = await this.superlikeStarModel.find({
      userId: { $in: platinumUsers },
    });
    for (let i = 0; i < platinumStars.length; i++) {
      platinumStars[i].amount = platinumStars[i].amount + 5;
      await this.superlikeStarModel.findByIdAndUpdate(
        platinumStars[i]._id,
        platinumStars[i],
      );
    }
  }

  // @Cron('*/5 * * * * *')
  @Cron('0 0 1 * *')
  async cronJobRemoveNopeList() {
    let platinumUsers = await this.userModel.aggregate([
      {
        $match: {
          role: Role.KmatchPlatinum,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    platinumUsers = platinumUsers.map((user) => user._id.toString());
    console.log(platinumUsers);
    await this.dislikeUserModel.deleteMany({
      userDislikedId: { $in: platinumUsers },
    });
  }
}
