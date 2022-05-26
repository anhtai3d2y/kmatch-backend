import { Injectable } from '@nestjs/common';
import { CreatePaypalDto } from './dto/create-paypal.dto';
import { UpdatePaypalDto } from './dto/update-paypal.dto';

@Injectable()
export class PaypalService {
  create(createPaypalDto: CreatePaypalDto, req, paypal, res) {
    var create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${process.env.REACT_APP_BACKEND_URL}/api/paypal-success`,
        cancel_url: `${process.env.REACT_APP_BACKEND_URL}/api/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: req.body.arrDetails,
          },
          amount: {
            currency: 'USD',
            total: req.body.totalPrice,
          },
          description: 'This is the payment description.',
        },
      ],
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            return res.status(200).json({
              errCode: 0,
              errMessage: 'Ok',
              paymentId: payment.id,
              paypalLink: payment.links[i].href,
            });
          }
        }
      }
    });
  }

  paymentSuccess() {
    return `This action returns all paypal`;
  }

  paymentCancel() {
    return `This action returns all paypal`;
  }
}
