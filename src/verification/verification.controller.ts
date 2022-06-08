import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageErrorService } from 'src/message-error/message-error';
import { Response } from 'utils/response';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { GetVerificationDto } from './dto/get-verification.dto';
import { VerificationService } from './verification.service';
@ApiTags('verification')
@Controller('verification')
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly messageError: MessageErrorService,
  ) {}

  @ApiOperation({ summary: 'Get verification' })
  @Get()
  async getVerification(
    @Query() getVerificationDto: GetVerificationDto,
  ): Promise<Response> {
    try {
      const data: any = await this.verificationService.getVerification(
        getVerificationDto,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Get successfully',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }

  @ApiOperation({ summary: 'Add new verification' })
  @ApiBody({
    type: CreateVerificationDto,
    required: true,
    description: 'Add new verification',
  })
  @Post()
  async create(
    @Body() createVerificationDto: CreateVerificationDto,
  ): Promise<Response> {
    try {
      const data: any = await this.verificationService.create(
        createVerificationDto,
      );
      return {
        statusCode: HttpStatus.OK,
        message:
          'Create successfully! Pls check the email sended to your mail.',
        data: data,
      };
    } catch (e) {
      return this.messageError.messageErrorController(e);
    }
  }
}
