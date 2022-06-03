import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Res,
  Param,
  Query,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { CreatePaypalDto } from './dto/create-paypal.dto';
import { ApiTags } from '@nestjs/swagger';
import { MessageErrorService } from 'src/message-error/message-error';
import { Response } from 'utils/response';
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});
@ApiTags('paypal')
@Controller('paypal')
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly messageError: MessageErrorService,
  ) {}

  @Post()
  async create(
    @Res() res,
    @Request() req,
    @Body() createPaypalDto: CreatePaypalDto,
  ): Promise<any> {
    try {
      this.paypalService.create(createPaypalDto, paypal, req, res);
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @Get('success')
  async paymentSuccess(@Query() query, @Res() res) {
    await this.paypalService.paymentSuccess(query);
    return res.redirect('/api');
  }

  @Get('cancel')
  async paymentCancel(@Query() query, @Res() res) {
    await this.paypalService.paymentCancel(query.token);
    return res.redirect('/api');
  }
}
