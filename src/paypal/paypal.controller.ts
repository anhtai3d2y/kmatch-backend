import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Res,
  HttpStatus,
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
    @Request() req,
    @Body() createPaypalDto: CreatePaypalDto,
  ): Promise<Response> {
    try {
      const data = await this.paypalService.create(
        createPaypalDto,
        req,
        paypal,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Create payment successfully!',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @Get('success')
  async paymentSuccess(@Res() res) {
    return await res.redirect(this.paypalService.paymentSuccess());
  }

  @Get('cancel')
  async paymentCancel() {
    return await this.paypalService.paymentCancel();
  }
}
