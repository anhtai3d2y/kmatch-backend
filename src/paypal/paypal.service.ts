import { Injectable } from '@nestjs/common';
import { CreatePaypalDto } from './dto/create-paypal.dto';

@Injectable()
export class PaypalService {
  async create(createPaypalDto: CreatePaypalDto, req, paypal) {
    let data = {
      paymentId: '',
      paypalLink: '',
    };
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
                name: 'Kmatch gold',
                sku: '001',
                price: '1.00',
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: '1.00',
          },
          description: 'This is the payment description.',
        },
      ],
    };
    paypal.payment.create(create_payment_json, function async(error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            data.paymentId = payment.id;
            data.paypalLink = payment.links[i].href;
            console.log(data);
            // return {
            //   paymentId: payment.id,
            //   paypalLink: payment.links[i].href,
            // };
          }
        }
      }
    });
  }

  paymentSuccess() {
    return '/api';
  }

  paymentCancel() {
    return `This is cancel payment`;
  }
}
