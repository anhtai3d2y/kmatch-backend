import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Boots } from 'src/boots/interfaces/boots.interfaces';
import { SuperlikeStar } from 'src/superlike-star/interfaces/superlike-star.interfaces';
import { User } from 'src/users/interfaces/user.interfaces';
import { PackageType } from 'utils/constants/enum/packageType.enum';
import { formatDate } from 'utils/util';
import { CreatePaypalDto } from './dto/create-paypal.dto';
import { Paypal } from './interfaces/paypal.interfaces';

@Injectable()
export class PaypalService {
  constructor(
    @InjectModel('Paypal')
    private readonly paypalModel: Model<Paypal>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('SuperlikeStar')
    private readonly superlikeStarModel: Model<SuperlikeStar>,
    @InjectModel('Boots')
    private readonly bootsModel: Model<Boots>,
  ) {}
  async create(createPaypalDto: CreatePaypalDto, paypal, user, res) {
    const userId = user._id.toString();
    const packageName: string = createPaypalDto.package
      .split(' ')
      .join('_')
      .toUpperCase();
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${process.env.BACKEND_URL}/paypal/success`,
        cancel_url: `${process.env.BACKEND_URL}/paypal/cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: createPaypalDto.package,
                sku: '001',
                price: process.env[packageName],
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: process.env[packageName],
          },
          description: `You are making a payment for ${createPaypalDto.package}`,
        },
      ],
    };
    await paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            const token = payment.links[i].href.slice(
              payment.links[i].href.indexOf('token') + 6,
            );
            await this.paypalModel.create({
              userId: userId,
              type: createPaypalDto.type,
              package: createPaypalDto.package,
              price: process.env[packageName],
              paymentId: payment.id,
              token: token,
              isCompleted: false,
            });
            const data = {
              paymentId: payment.id,
              paypalLink: payment.links[i].href,
            };
            return res.status(200).json({
              statusCode: HttpStatus.OK,
              message: 'Create payment successfully!',
              data: data,
            });
          }
        }
      }
    });
  }

  async getPaymentHistory(user) {
    const data = await this.paypalModel.aggregate([
      {
        $match: {
          userId: user._id.toString(),
          isCompleted: true,
        },
      },
    ]);
    for (let i = 0; i < data.length; i++) {
      data[i].time = formatDate(data[i].createdAt);
    }
    return data;
  }
  async paymentSuccess(query) {
    const payment = await this.paypalModel.findOne({
      paymentId: query.paymentId,
      token: query.token,
    });
    if (!payment.isCompleted) {
      try {
        switch (payment.type) {
          case PackageType.Role:
            await this.userModel.findByIdAndUpdate(payment.userId, {
              role: payment.package,
            });
            break;
          case PackageType.Star:
            const amountStar = parseInt(payment.package.split(' ')[2]);
            const superlikeStar = await this.superlikeStarModel.findOne({
              userId: payment.userId,
            });
            if (superlikeStar) {
              await superlikeStar.updateOne({
                amount: superlikeStar.amount + amountStar,
              });
            } else {
              await this.bootsModel.create({
                userId: payment.userId,
                amount: amountStar,
              });
            }
            break;
          case PackageType.Boots:
            const amountBoots = parseInt(payment.package.split(' ')[1]);
            const boots = await this.bootsModel.findOne({
              userId: payment.userId,
            });
            if (boots) {
              await boots.updateOne({
                amount: boots.amount + amountBoots,
              });
            } else {
              await this.bootsModel.create({
                userId: payment.userId,
                amount: amountBoots,
              });
            }
            break;
          default:
            break;
        }
        await payment.updateOne({
          isCompleted: true,
        });
        return;
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
    return;
  }

  async paymentCancel(token) {
    await this.paypalModel.deleteOne({
      token: token,
    });
  }
}
