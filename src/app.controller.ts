import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  redirect(@Res() res): Promise<any> {
    return res.redirect('/api');
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
