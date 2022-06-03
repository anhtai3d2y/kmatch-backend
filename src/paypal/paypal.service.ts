import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/interfaces/user.interfaces';
import { CreatePaypalDto } from './dto/create-paypal.dto';
import { Paypal } from './interfaces/paypal.interfaces';

@Injectable()
export class PaypalService {
  constructor(
    @InjectModel('Paypal')
    private readonly paypalModel: Model<Paypal>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}
  async create(createPaypalDto: CreatePaypalDto, paypal, req, res) {
    let packageType: string = createPaypalDto.package
      .replace(' ', '_')
      .toUpperCase();
    var create_payment_json = {
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
                price: process.env[packageType],
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: process.env[packageType],
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
              userId: createPaypalDto.userId,
              package: createPaypalDto.package,
              price: process.env[packageType],
              paymentId: payment.id,
              token: token,
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

  async paymentSuccess(query) {
    const payment = await this.paypalModel.findOne({
      paymentId: query.paymentId,
      token: query.token,
    });
    try {
      const data = await this.userModel.findByIdAndUpdate(payment.userId, {
        role: payment.package,
      });
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

  async paymentCancel(token) {
    await this.paypalModel.deleteOne({
      token: token,
    });
  }
}
