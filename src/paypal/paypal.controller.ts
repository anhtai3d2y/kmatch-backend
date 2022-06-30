import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Res,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PaypalService } from './paypal.service';
import { CreatePaypalDto } from './dto/create-paypal.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageErrorService } from 'src/message-error/message-error';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'common/guard/roles.guard';
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id:
    process.env.PAYPAL_CLIENT_ID ||
    'AeW1yFwajTaiDGXbasMaW7TzaNJiGwMPsNHXI7TAVspBpjwocg4z4lNaLtkXNMSuAnlVmT081miMrRBm',
  client_secret:
    process.env.PAYPAL_CLIENT_SECRET ||
    'EHugYMrVgLbSRDywiotgb08QZyAyfDPX7yvDRVdtmMOmjUFkSM0m_FQOioYo2hCqV2aIviAWWaNLAeKB',
});
@ApiTags('paypal')
@Controller('paypal')
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly messageError: MessageErrorService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  async create(
    @Res() res,
    @Request() req,
    @Body() createPaypalDto: CreatePaypalDto,
  ): Promise<any> {
    try {
      this.paypalService.create(createPaypalDto, paypal, req.user, res);
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  async getPaymentHistory(@Request() req): Promise<any> {
    try {
      const data = await this.paypalService.getPaymentHistory(req.user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Get payment successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @Get('success')
  async paymentSuccess(@Query() query, @Res() res: Response) {
    await this.paypalService.paymentSuccess(query);
    return res.sendFile('success.html', {
      root: './src/paypal/return-page',
    });
  }

  @Get('cancel')
  async paymentCancel(@Query() query, @Res() res: Response) {
    await this.paypalService.paymentCancel(query.token);
    return res.sendFile('calcel.html', {
      root: '/src/paypal/return-page',
    });
  }
}
