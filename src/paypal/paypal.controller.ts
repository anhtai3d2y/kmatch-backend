import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { CreatePaypalDto } from './dto/create-paypal.dto';
import { UpdatePaypalDto } from './dto/update-paypal.dto';
import { ApiTags } from '@nestjs/swagger';
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});
@ApiTags('paypal')
@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post()
  create(@Request() req, @Body() createPaypalDto: CreatePaypalDto) {
    return this.paypalService.create(createPaypalDto, req, paypal);
  }

  @Get('success')
  paymentSuccess() {
    return this.paypalService.paymentSuccess();
  }

  @Get('cancel')
  paymentCancel() {
    return this.paypalService.paymentCancel();
  }
}
